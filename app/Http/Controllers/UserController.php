<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Organization;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Enums\RoleEnum;

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
                'name' => $role->value,
                'label' => $role->label(),
            ])
            : collect();
        
        return Inertia::render('users/index', [
            'users' => $users,
            'organizations' => $organizations,
            'roles' => $roles,
            'filters' => $request->only(['search', 'status', 'organization_id', 'role']),
            'can' => [
                'create' => $currentUser->can('create-user-in-org'),
                'edit' => $currentUser->can('edit-user-in-org'),
                'delete' => $currentUser->can('delete-user-in-org'),
                'assign_role' => $currentUser->can('assign-role-to-user'),
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
        // if (!$currentUser->can('create-user')) {
        //     abort(403, 'شما دسترسی ایجاد کاربر را ندارید.');
        // }
        
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
        
        // لیست دپارتمان‌ها (برای زمانی که سازمان انتخاب شود)
        $departments = collect();
        
        // لیست پست‌ها (برای زمانی که دپارتمان انتخاب شود)
        $positions = collect();
        
        // نقش‌های قابل تخصیص
        $roles = collect(RoleEnum::cases())->map(fn($role) => [
            'name' => $role->value,
            'label' => $role->label(),
        ]);
        
        return Inertia::render('users/create', [
            'organizations' => $organizations,
            'departments' => $departments,
            'positions' => $positions,
            'roles' => $roles,
            'myOrganizationId' => $currentUser->organization_id,
        ]);
    }

    /**
     * ذخیره کاربر جدید
     */
    public function store(Request $request)
    {
        $currentUser = auth()->user();
        
        // اعتبارسنجی
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|exists:organizations,id',
            'department_id' => 'nullable|exists:departments,id',
            'primary_position_id' => 'nullable|exists:positions,id',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'national_code' => 'required|string|size:10|unique:users,national_code',
            'mobile' => 'nullable|string|max:20',
            'employment_code' => 'nullable|string|max:50|unique:users,employment_code',
            'status' => 'required|in:active,inactive,suspended',
            'security_clearance' => 'required|in:public,internal,confidential,secret',
            'role' => 'required|string|exists:roles,name',
        ], [
            'organization_id.required' => 'انتخاب سازمان الزامی است',
            'username.required' => 'نام کاربری الزامی است',
            'username.unique' => 'این نام کاربری قبلاً ثبت شده است',
            'email.required' => 'ایمیل الزامی است',
            'email.unique' => 'این ایمیل قبلاً ثبت شده است',
            'password.required' => 'رمز عبور الزامی است',
            'password.min' => 'رمز عبور باید حداقل ۸ کاراکتر باشد',
            'password.confirmed' => 'تکرار رمز عبور مطابقت ندارد',
            'first_name.required' => 'نام الزامی است',
            'last_name.required' => 'نام خانوادگی الزامی است',
            'national_code.required' => 'کد ملی الزامی است',
            'national_code.size' => 'کد ملی باید ۱۰ رقم باشد',
            'national_code.unique' => 'این کد ملی قبلاً ثبت شده است',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // ============================================
        // بررسی دسترسی برای ایجاد کاربر در سازمان خاص
        // ============================================
        
        $targetOrganizationId = $request->organization_id;
        
        if ($currentUser->isSuperAdmin()) {
            // ادمین کل: مجاز است
        } elseif ($currentUser->isOrgAdmin() && $currentUser->organization_id == $targetOrganizationId) {
            // ادمین سازمان: فقط در سازمان خودش مجاز است
        } else {
            abort(403, 'شما دسترسی ایجاد کاربر در این سازمان را ندارید.');
        }
        
        // بررسی نقش: ادمین سازمان نمی‌تواند نقش ادمین کل بدهد
        if ($currentUser->isOrgAdmin() && $request->role === RoleEnum::SUPER_ADMIN->value) {
            return back()->withErrors(['role' => 'شما نمی‌توانید نقش ادمین کل را تخصیص دهید.'])->withInput();
        }
        
        // ایجاد کاربر
        $user = User::create([
            'organization_id' => $request->organization_id,
            'department_id' => $request->department_id,
            'primary_position_id' => $request->primary_position_id,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'national_code' => $request->national_code,
            'mobile' => $request->mobile,
            'employment_code' => $request->employment_code,
            'status' => $request->status,
            'security_clearance' => $request->security_clearance,
        ]);
        
        // تخصیص نقش
        $user->assignRole($request->role);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'user_created',
            "کاربر {$user->full_name} با نقش {$request->role} ایجاد شد",
            $user,
            ['role' => $request->role]
        );
        
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
        if (!$currentUser->isSuperAdmin() && 
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id) &&
            !($currentUser->isDeptManager() && $currentUser->department_id === $user->department_id) &&
            $currentUser->id !== $user->id) {
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
        if (!$currentUser->isSuperAdmin() && 
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id) &&
            !($currentUser->isDeptManager() && $currentUser->department_id === $user->department_id) &&
            $currentUser->id !== $user->id) {
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
    public function update(Request $request, User $user)
    {
        $currentUser = auth()->user();
        
        // بررسی دسترسی
        if (!$currentUser->isSuperAdmin() && 
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id) &&
            !($currentUser->isDeptManager() && $currentUser->department_id === $user->department_id) &&
            $currentUser->id !== $user->id) {
            abort(403);
        }
        
        // اعتبارسنجی
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'mobile' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive,suspended',
        ];
        
        // ادمین‌ها می‌توانند اطلاعات بیشتری ویرایش کنند
        if ($currentUser->isSuperAdmin() || $currentUser->isOrgAdmin()) {
            $rules['organization_id'] = 'required|exists:organizations,id';
            $rules['department_id'] = 'nullable|exists:departments,id';
            $rules['primary_position_id'] = 'nullable|exists:positions,id';
            $rules['username'] = 'required|string|max:255|unique:users,username,' . $user->id;
            $rules['email'] = 'required|email|max:255|unique:users,email,' . $user->id;
            $rules['national_code'] = 'required|string|size:10|unique:users,national_code,' . $user->id;
            $rules['employment_code'] = 'nullable|string|max:50|unique:users,employment_code,' . $user->id;
            $rules['security_clearance'] = 'required|in:public,internal,confidential,secret';
        }
        
        // اگر رمز عبور ارسال شده
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:8|confirmed';
        }
        
        $validator = Validator::make($request->all(), $rules);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // داده‌های قابل به‌روزرسانی
        $data = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'mobile' => $request->mobile,
            'status' => $request->status,
        ];
        
        // ادمین‌ها می‌توانند اطلاعات بیشتری به‌روزرسانی کنند
        if ($currentUser->isSuperAdmin() || $currentUser->isOrgAdmin()) {
            $data['organization_id'] = $request->organization_id;
            $data['department_id'] = $request->department_id;
            $data['primary_position_id'] = $request->primary_position_id;
            $data['username'] = $request->username;
            $data['email'] = $request->email;
            $data['national_code'] = $request->national_code;
            $data['employment_code'] = $request->employment_code;
            $data['security_clearance'] = $request->security_clearance;
        }
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        
        $user->update($data);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'user_updated',
            "کاربر {$user->full_name} به‌روزرسانی شد",
            $user
        );
        
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
        if (!$currentUser->isSuperAdmin() && 
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id)) {
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
        
        if (!$currentUser->isSuperAdmin() && 
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $user->organization_id)) {
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