<?php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Models\User;
use App\Models\Organization;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Enums\RoleEnum;
use App\Http\Requests\UserRequest;

class UserController extends Controller
{
    /**
     * نمایش لیست کاربران (بر اساس سطح دسترسی)
     */
    public function index(Request $request)
    {
        $currentUser = auth()->user();

        $query = User::query()
            ->with(['organization', 'department', 'primaryPosition', 'positions', 'roles']);

        // ============================================
        // فیلتر بر اساس سطح دسترسی (مهم)
        // ============================================

        if ($currentUser->isSuperAdmin()) {
            // ادمین کل: همه کاربران از همه سازمان‌ها
            if ($request->has('organization_id') && $request->organization_id) {
                $query->where('organization_id', $request->organization_id);
            }
        } elseif ($currentUser->isOrgAdmin()) {
            // ادمین سازمان: فقط کاربران سازمان خودش
            $query->where('organization_id', $currentUser->organization_id);
        } elseif ($currentUser->isDeptManager()) {
            // مدیر دپارتمان: فقط کاربران دپارتمان خودش
            $query->where('department_id', $currentUser->department_id);
        } else {
            // کاربر عادی: فقط خودش
            $query->where('id', $currentUser->id);
        }

        // فیلتر جستجو
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('username', 'like', "%{$request->search}%")
                    ->orWhere('national_code', 'like', "%{$request->search}%")
                    ->orWhere('employment_code', 'like', "%{$request->search}%");
            });
        }

        // فیلتر وضعیت
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // فیلتر نقش
        if ($request->has('role') && $request->role && $currentUser->isSuperAdmin()) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        $users = $query->paginate(15);

        // برای ادمین کل، لیست سازمان‌ها و نقش‌ها را هم ارسال کن
        $organizations = $currentUser->isSuperAdmin()
            ? Organization::where('status', 'active')->get()
            : collect();

        $roles = $currentUser->isSuperAdmin() || $currentUser->isOrgAdmin()
            ? collect(RoleEnum::cases())->map(fn($role) => [
                'name'                  => $role->value,
                'label'                 => $role->label(),
            ])
            : collect();

        return Inertia::render('users/index', [
            'users'                     => $users,
            'organizations'             => $organizations,
            'roles'                     => $roles,
            'filters'                   => $request->only(['search', 'status', 'organization_id', 'role']),
            'can'                       => [
                'create'                => $currentUser->can(PermissionEnum::CREATE_USER) && ($currentUser->isSuperAdmin() || $currentUser->isOrgAdmin()),
                'edit'                  => $currentUser->can(PermissionEnum::EDIT_USER),
                'delete'                => $currentUser->can(PermissionEnum::DELETE_USER),
                'assign_role'           => $currentUser->can(PermissionEnum::ASSIGN_ROLE),
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد کاربر جدید
     */
    public function create()
    {
        $currentUser = auth()->user();

        // بررسی دسترسی کلی برای ایجاد کاربر
        if (!$currentUser->can(PermissionEnum::CREATE_USER)) {
            abort(403, 'شما دسترسی ایجاد کاربر را ندارید.');
        }

        // تعیین لیست سازمان‌های قابل انتخاب
        if ($currentUser->isSuperAdmin()) {
            $organizations = Organization::where('status', 'active')->get();
        } elseif ($currentUser->isOrgAdmin()) {
            $organizations = Organization::where('id', $currentUser->organization_id)
                ->where('status', 'active')
                ->get();
        } else {
            $organizations = collect();
        }

        $departments = collect();

        $positions = collect();

        $roles = collect(RoleEnum::cases())->map(fn($role) => [
            'name'                              => $role->value,
            'label'                             => $role->label(),
        ]);

        return Inertia::render('users/create', [
            'organizations'                     => $organizations,
            'departments'                       => $departments,
            'positions'                         => $positions,
            'roles'                             => $roles,
            'myOrganizationId'                  => $currentUser->organization_id,
        ]);
    }

    /**
     * ذخیره کاربر جدید
     */
    public function store(UserRequest $request)
    {
        $currentUser = auth()->user();
        $targetOrganizationId = $request->organization_id;

        if (!$currentUser->canManageOrganization($targetOrganizationId)) {
            return back()->withErrors(['organization_id' => 'شما دسترسی ایجاد کاربر در این سازمان را ندارید.'])->withInput();
        }

        if ($currentUser->isOrgAdmin() && $request->role === RoleEnum::SUPER_ADMIN->value) {
            return back()->withErrors(['role' => 'شما نمی‌توانید نقش ادمین کل را تخصیص دهید.'])->withInput();
        }

        if ($currentUser->isOrgAdmin()) {
            $roleHierarchy = [
                'super-admin'                   => 4,
                'org-admin'                     => 3,
                'dept-manager'                  => 2,
                'user'                          => 1,
            ];

            $currentUserRoleLevel = $roleHierarchy[$currentUser->roles->first()->name] ?? 0;
            $targetRoleLevel = $roleHierarchy[$request->role] ?? 0;

            if ($targetRoleLevel >= $currentUserRoleLevel) {
                return back()->withErrors(['role' => 'شما نمی‌توانید نقشی بالاتر از نقش خود تخصیص دهید.'])->withInput();
            }
        }

        // ============================================
        // 4. ایجاد کاربر
        // ============================================
        $user = User::create([
            'organization_id'                           => $request->organization_id,
            'department_id'                             => $request->department_id,
            'primary_position_id'                       => $request->primary_position_id,
            'email'                                     => $request->email,
            'password'                                  => Hash::make($request->password),
            'first_name'                                => $request->first_name,
            'last_name'                                 => $request->last_name,
            'national_code'                             => $request->national_code,
            'mobile'                                    => $request->mobile,
            'employment_code'                           => User::generateCode(),
            'gender'                                    => 'male',
            'birth_date'                                => $request->birth_date,
            'emergency_phone'                           => $request->emergency_phone,
            'address'                                   => $request->address,
            'status'                                    => $request->status,
            'security_clearance'                        => $request->security_clearance,
            'locale'                                    => 'fa',
            'timezone'                                  => 'Asia/Kabul',
        ]);

        // ============================================
        // 5. تخصیص نقش
        // ============================================
        $user->assignRole($request->role);

        // ============================================
        // 6. ذخیره رابطه user_positions (در صورت وجود department_id و primary_position_id)
        // ============================================
        if ($request->department_id && $request->primary_position_id) {
            $user->positions()->attach($request->primary_position_id, [
                'is_primary' => true,
                'start_date' => now(),
                'status' => 'active',
            ]);
        }

        return redirect()->route('users.index')
            ->with('success', 'کاربر با موفقیت ایجاد شد.');
    }

    /**
     * نمایش جزئیات کاربر
     */
    public function show(User $user)
    {
        $currentUser = auth()->user();

        // بررسی دسترسی
        if (
            !$currentUser->isSuperAdmin() &&
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id) &&
            !($currentUser->isDeptManager() && $currentUser->department_id === $user->department_id) &&
            $currentUser->id !== $user->id
        ) {
            abort(403);
        }

        $user->load([
            'organization',
            'department',
            'primaryPosition',
            'positions.department',
            'roles',
        ]);

        // آمار فعالیت‌های کاربر
        $stats = [
            'created_letters' => $user->createdLetters()->count(),
            'assigned_routings' => $user->routingsTo()->where('status', 'pending')->count(),
            'completed_actions' => $user->actions()->count(),
        ];

        return Inertia::render('users/show', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * نمایش فرم ویرایش کاربر
     */
    public function edit(User $user)
    {
        $currentUser = auth()->user();

        // بررسی دسترسی
        if (
            !$currentUser->isSuperAdmin() &&
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id) &&
            !($currentUser->isDeptManager() && $currentUser->department_id === $user->department_id) &&
            $currentUser->id !== $user->id
        ) {
            abort(403);
        }

        // تعیین لیست سازمان‌ها
        if ($currentUser->isSuperAdmin()) {
            $organizations = Organization::where('status', 'active')->get();
        } elseif ($currentUser->isOrgAdmin()) {
            $organizations = Organization::where('id', $currentUser->organization_id)->get();
        } else {
            $organizations = collect();
        }

        // لیست دپارتمان‌های سازمان کاربر
        $departments = Department::where('organization_id', $user->organization_id)
            ->where('status', 'active')
            ->get();

        // لیست پست‌های دپارتمان کاربر
        $positions = Position::where('department_id', $user->department_id)->get();

        // نقش‌های قابل تخصیص
        $roles = collect(RoleEnum::cases())->map(fn($role) => [
            'name' => $role->value,
            'label' => $role->label(),
        ]);

        return Inertia::render('users/edit', [
            'user' => $user->load(['roles']),
            'organizations' => $organizations,
            'departments' => $departments,
            'positions' => $positions,
            'roles' => $roles,
            'userRole' => $user->roles->first()?->name,
            'canEditRole' => $currentUser->can('assign-role') &&
                ($currentUser->isSuperAdmin() ||
                    ($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id)),
        ]);
    }

    /**
     * به‌روزرسانی کاربر
     */
    public function update(UserRequest $request, User $user)
    {
        $currentUser = auth()->user();
        $targetOrganizationId = $request->organization_id;

        // ============================================
        // 1. بررسی دسترسی به سازمان
        // ============================================
        if (!$currentUser->canManageOrganization($targetOrganizationId)) {
            return back()->withErrors(['organization_id' => 'شما دسترسی ویرایش کاربر در این سازمان را ندارید.'])->withInput();
        }

        // ============================================
        // 2. محدودیت org-admin برای نقش super-admin
        // ============================================
        if ($currentUser->isOrgAdmin() && $request->role === RoleEnum::SUPER_ADMIN->value) {
            return back()->withErrors(['role' => 'شما نمی‌توانید نقش ادمین کل را تخصیص دهید.'])->withInput();
        }

        // ============================================
        // 3. محدودیت سلسله مراتب نقش‌ها
        // ============================================
        if ($currentUser->isOrgAdmin()) {
            $roleHierarchy = [
                'super-admin'   => 4,
                'org-admin'     => 3,
                'dept-manager'  => 2,
                'user'          => 1,
            ];

            $currentUserRoleLevel = $roleHierarchy[$currentUser->roles->first()->name] ?? 0;
            $targetRoleLevel = $roleHierarchy[$request->role] ?? 0;

            if ($targetRoleLevel > $currentUserRoleLevel) {
                return back()->withErrors(['role' => 'شما نمی‌توانید نقشی بالاتر از نقش خود تخصیص دهید.'])->withInput();
            }
        }

        // ============================================
        // 4. آماده‌سازی داده‌ها برای آپدیت
        // ============================================
        $data = [
            'organization_id'       => $request->organization_id,
            'department_id'         => $request->department_id,
            'primary_position_id'   => $request->primary_position_id,
            'email'                 => $request->email,
            'first_name'            => $request->first_name,
            'last_name'             => $request->last_name,
            'national_code'         => $request->national_code,
            'mobile'                => $request->mobile,
            'birth_date'            => $request->birth_date,
            'emergency_phone'       => $request->emergency_phone,
            'address'               => $request->address,
            'status'                => $request->status,
            'security_clearance'    => $request->security_clearance,
        ];

        // فقط اگر رمز عبور جدید وارد شده باشد، آن را آپدیت کن
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // ============================================
        // 5. آپدیت کاربر
        // ============================================
        $user->update($data);

        // ============================================
        // 6. همگام‌سازی نقش
        // ============================================
        $user->syncRoles([$request->role]);

        // ============================================
        // 7. آپدیت رابطه user_positions
        // ============================================
        if ($request->department_id && $request->primary_position_id) {
            // حذف position های قبلی
            $user->positions()->detach();

            // اضافه کردن position جدید
            $user->positions()->attach($request->primary_position_id, [
                'is_primary' => true,
                'start_date' => now(),
                'status' => 'active',
            ]);
        } else {
            // اگر department یا position نال است، همه position ها را حذف کن
            $user->positions()->detach();
        }

        return redirect()->route('users.index')
            ->with('success', 'کاربر با موفقیت به‌روزرسانی شد.');
    }

    /**
     * تخصیص نقش به کاربر (فقط برای ادمین‌ها)
     */
    public function assignRole(Request $request, User $user)
    {
        $currentUser = auth()->user();

        // ============================================
        // فقط ادمین کل و ادمین سازمان می‌توانند نقش بدهند
        // ============================================

        if ($currentUser->isSuperAdmin()) {
            // ادمین کل: می‌تواند هر نقشی بدهد
        } elseif ($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id) {
            // ادمین سازمان: می‌تواند نقش بدهد، اما نمی‌تواند نقش ادمین کل بدهد
            if ($request->role === RoleEnum::SUPER_ADMIN->value) {
                return response()->json([
                    'message' => 'شما نمی‌توانید نقش ادمین کل را تخصیص دهید.'
                ], 403);
            }
        } else {
            return response()->json([
                'message' => 'شما دسترسی تخصیص نقش را ندارید.'
            ], 403);
        }

        $oldRole = $user->roles->first()?->name;
        $user->syncRoles([$request->role]);

        // لاگ عملیات
        \App\Models\EventLog::log(
            'role_assigned',
            "نقش کاربر {$user->full_name} از {$oldRole} به {$request->role} تغییر کرد",
            $user,
            ['old_role' => $oldRole, 'new_role' => $request->role]
        );

        return response()->json([
            'message' => 'نقش با موفقیت تخصیص یافت.',
            'role' => $request->role
        ]);
    }

    /**
     * حذف کاربر (غیرفعال کردن)
     */
    public function destroy(User $user)
    {
        $currentUser = auth()->user();

        // فقط ادمین کل یا ادمین سازمان می‌توانند حذف کنند
        if (
            !$currentUser->isSuperAdmin() &&
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id)
        ) {
            abort(403, 'شما دسترسی حذف این کاربر را ندارید.');
        }

        // جلوگیری از حذف خودش
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'شما نمی‌توانید حساب کاربری خودتان را حذف کنید.');
        }

        $userName = $user->full_name;
        $user->delete();

        // لاگ عملیات
        \App\Models\EventLog::log(
            'user_deleted',
            "کاربر {$userName} حذف شد",
            $user
        );

        return redirect()->route('users.index')
            ->with('success', 'کاربر با موفقیت حذف شد.');
    }

    /**
     * تغییر وضعیت کاربر (فعال/غیرفعال/تعلیق)
     */
    public function toggleStatus(User $user)
    {
        $currentUser = auth()->user();

        if (
            !$currentUser->isSuperAdmin() &&
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id)
        ) {
            abort(403);
        }

        $statuses = ['active', 'inactive', 'suspended'];
        $currentIndex = array_search($user->status, $statuses);
        $newStatus = $statuses[($currentIndex + 1) % count($statuses)];

        $user->update(['status' => $newStatus]);

        return back()->with('success', "وضعیت کاربر به " . ($newStatus === 'active' ? 'فعال' : ($newStatus === 'inactive' ? 'غیرفعال' : 'تعلیق')) . " تغییر کرد.");
    }

    /**
     * دریافت دپارتمان‌های یک سازمان (برای API)
     */
    public function getDepartmentsByOrganization(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|exists:organizations,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['departments' => []]);
        }

        $departments = Department::where('organization_id', $request->organization_id)
            ->where('status', 'active')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json(['departments' => $departments]);
    }

    /**
     * دریافت پست‌های یک دپارتمان (برای API)
     */
    public function getPositionsByDepartment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['positions' => []]);
        }

        $positions = Position::where('department_id', $request->department_id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json(['positions' => $positions]);
    }
}
