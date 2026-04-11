<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Organization;
use App\Models\User;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function __construct()
    {
        // ادمین کل و ادمین سازمان می‌توانند به این کنترلر دسترسی داشته باشند
        $this->middleware(['auth']);
        $this->middleware(['role:super-admin|org-admin'])->except(['index', 'show']);
    }

    /**
     * نمایش لیست دپارتمان‌ها
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Department::with(['organization', 'parent', 'managerPosition']);
        
        // فیلتر بر اساس سازمان (برای ادمین سازمان)
        if ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id);
        } elseif ($request->has('organization_id') && $user->isSuperAdmin()) {
            $query->where('organization_id', $request->organization_id);
        }
        
        // فیلتر جستجو
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            });
        }
        
        // فیلتر وضعیت
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        $departments = $query->paginate(15);
        
        // برای فیلتر سازمان (فقط ادمین کل)
        $organizations = $user->isSuperAdmin() ? Organization::all() : null;
        
        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'organizations' => $organizations,
            'filters' => $request->only(['search', 'status', 'organization_id']),
            'can' => [
                'create' => $user->can('create-department'),
                'edit' => $user->can('edit-department'),
                'delete' => $user->can('delete-department'),
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد دپارتمان جدید
     */
    public function create(Request $request)
    {
        $user = auth()->user();
        
        // تعیین سازمان‌های قابل انتخاب
        if ($user->isSuperAdmin()) {
            $organizations = Organization::where('status', 'active')->get();
            $selectedOrganization = $request->organization_id;
        } else {
            $organizations = Organization::where('id', $user->organization_id)
                ->where('status', 'active')
                ->get();
            $selectedOrganization = $user->organization_id;
        }
        
        // دپارتمان‌های والد (همان سازمان)
        $parentDepartments = Department::where('organization_id', $selectedOrganization)
            ->where('status', 'active')
            ->get();
        
        return Inertia::render('Departments/Create', [
            'organizations' => $organizations,
            'parentDepartments' => $parentDepartments,
            'selectedOrganization' => $selectedOrganization,
        ]);
    }

    /**
     * ذخیره دپارتمان جدید
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        // اعتبارسنجی
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code',
            'parent_id' => 'nullable|exists:departments,id',
            'manager_position_id' => 'nullable|exists:positions,id',
            'status' => 'required|in:active,inactive',
        ], [
            'organization_id.required' => 'انتخاب سازمان الزامی است',
            'name.required' => 'نام دپارتمان الزامی است',
            'code.required' => 'کد دپارتمان الزامی است',
            'code.unique' => 'این کد قبلاً ثبت شده است',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // بررسی دسترسی به سازمان
        if (!$user->isSuperAdmin() && $user->organization_id != $request->organization_id) {
            abort(403, 'شما دسترسی ایجاد دپارتمان در این سازمان را ندارید.');
        }
        
        // محاسبه سطح و مسیر
        $level = 0;
        $path = null;
        
        if ($request->parent_id) {
            $parent = Department::find($request->parent_id);
            if ($parent) {
                $level = $parent->level + 1;
                $path = $parent->path ? $parent->path . '/' . $parent->id : (string) $parent->id;
            }
        }
        
        // ایجاد دپارتمان
        $department = Department::create([
            'organization_id' => $request->organization_id,
            'name' => $request->name,
            'code' => $request->code,
            'parent_id' => $request->parent_id,
            'manager_position_id' => $request->manager_position_id,
            'status' => $request->status,
            'level' => $level,
            'path' => $path,
        ]);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'department_created',
            "دپارتمان {$department->name} در سازمان {$department->organization->name} ایجاد شد",
            $department
        );
        
        return redirect()->route('departments.index')
            ->with('success', 'دپارتمان با موفقیت ایجاد شد.');
    }

    /**
     * نمایش جزئیات دپارتمان
     */
    public function show(Department $department)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $department->organization_id) {
            abort(403);
        }
        
        $department->load([
            'organization',
            'parent',
            'children',
            'managerPosition',
            'positions' => function ($q) {
                $q->withCount('users');
            },
        ]);
        
        // آمار
        $stats = [
            'total_positions' => $department->positions->count(),
            'total_users' => User::whereHas('positions', function ($q) use ($department) {
                $q->where('department_id', $department->id);
            })->count(),
            'active_positions' => $department->positions->where('deleted_at', null)->count(),
            'child_departments' => $department->children->count(),
        ];
        
        return Inertia::render('Departments/Show', [
            'department' => $department,
            'stats' => $stats,
        ]);
    }

    /**
     * نمایش فرم ویرایش دپارتمان
     */
    public function edit(Department $department)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $department->organization_id) {
            abort(403);
        }
        
        // سازمان‌های قابل انتخاب
        if ($user->isSuperAdmin()) {
            $organizations = Organization::where('status', 'active')->get();
        } else {
            $organizations = Organization::where('id', $user->organization_id)->get();
        }
        
        // دپارتمان‌های والد (به جز خودش)
        $parentDepartments = Department::where('organization_id', $department->organization_id)
            ->where('id', '!=', $department->id)
            ->where('status', 'active')
            ->get();
        
        // پست‌های سازمانی قابل انتخاب به عنوان manager
        $managerPositions = Position::where('department_id', $department->id)
            ->where('is_management', true)
            ->get();
        
        return Inertia::render('Departments/Edit', [
            'department' => $department,
            'organizations' => $organizations,
            'parentDepartments' => $parentDepartments,
            'managerPositions' => $managerPositions,
        ]);
    }

    /**
     * به‌روزرسانی دپارتمان
     */
    public function update(Request $request, Department $department)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $department->organization_id) {
            abort(403);
        }
        
        // اعتبارسنجی
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code,' . $department->id,
            'parent_id' => 'nullable|exists:departments,id|not_in:' . $department->id,
            'manager_position_id' => 'nullable|exists:positions,id',
            'status' => 'required|in:active,inactive',
        ], [
            'code.unique' => 'این کد قبلاً ثبت شده است',
            'parent_id.not_in' => 'دپارتمان نمی‌تواند والد خودش باشد',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // محاسبه سطح و مسیر
        $level = 0;
        $path = null;
        
        if ($request->parent_id) {
            $parent = Department::find($request->parent_id);
            if ($parent) {
                $level = $parent->level + 1;
                $path = $parent->path ? $parent->path . '/' . $parent->id : (string) $parent->id;
            }
        }
        
        $oldName = $department->name;
        
        // به‌روزرسانی
        $department->update([
            'organization_id' => $request->organization_id,
            'name' => $request->name,
            'code' => $request->code,
            'parent_id' => $request->parent_id,
            'manager_position_id' => $request->manager_position_id,
            'status' => $request->status,
            'level' => $level,
            'path' => $path,
        ]);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'department_updated',
            "دپارتمان {$oldName} به {$department->name} به‌روزرسانی شد",
            $department,
            ['old_name' => $oldName, 'new_name' => $department->name]
        );
        
        return redirect()->route('departments.index')
            ->with('success', 'دپارتمان با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف دپارتمان
     */
    public function destroy(Department $department)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $department->organization_id) {
            abort(403);
        }
        
        // بررسی وجود زیردپارتمان
        if ($department->children()->count() > 0) {
            return back()->with('error', 'این دپارتمان دارای زیردپارتمان است و قابل حذف نمی‌باشد.');
        }
        
        // بررسی وجود پست سازمانی
        if ($department->positions()->count() > 0) {
            return back()->with('error', 'این دپارتمان دارای پست سازمانی است و قابل حذف نمی‌باشد.');
        }
        
        $departmentName = $department->name;
        $department->delete();
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'department_deleted',
            "دپارتمان {$departmentName} حذف شد",
            $department
        );
        
        return redirect()->route('departments.index')
            ->with('success', 'دپارتمان با موفقیت حذف شد.');
    }
    
    /**
     * تغییر وضعیت دپارتمان
     */
    public function toggleStatus(Department $department)
    {
        $user = auth()->user();
        
        if (!$user->isSuperAdmin() && $user->organization_id != $department->organization_id) {
            abort(403);
        }
        
        $newStatus = $department->status === 'active' ? 'inactive' : 'active';
        $department->update(['status' => $newStatus]);
        
        return back()->with('success', 'وضعیت دپارتمان با موفقیت تغییر کرد.');
    }
    
    /**
     * دریافت دپارتمان‌ها برای API (برای select box)
     */
    public function getList(Request $request)
    {
        $user = auth()->user();
        $query = Department::select('id', 'name', 'code', 'organization_id')
            ->with('organization:id,name');
        
        // فیلتر بر اساس سازمان
        if ($request->has('organization_id')) {
            $query->where('organization_id', $request->organization_id);
        } elseif ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $departments = $query->orderBy('name')->get();
        
        return response()->json($departments);
    }
}