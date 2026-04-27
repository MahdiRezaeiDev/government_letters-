<?php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Http\Requests\PositionRequest;
use App\Models\Position;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * نمایش لیست سمت‌ها
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $positions = Position::with(['department.organization'])
        ->when($request->has('department_id') && $request->department_id, function ($query) use ($request) {
            $query->where('department_id', $request->department_id);

        })->when($user->isOrgAdmin(), function ($query) use ($user) {
            $query->whereHas('department', function ($query) use ($user) {
                $query->where('organization_id', $user->organization_id);
            });

        })->when($request->has('search') && $request->search, function ($query) use ($request) {
            $query->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            });

        })->paginate(15);
        
        // لیست دپارتمان‌ها برای فیلتر
        $departmentsQuery = Department::with('organization');
        if ($user->isOrgAdmin()) {
            $departmentsQuery->where('organization_id', $user->organization_id);
        }
        $departments = $departmentsQuery->get();
        
        return Inertia::render('positions/index', [
            'positions'                 => $positions,
            'departments'               => $departments,
            'filters'                   => $request->only(['search', 'department_id']),
            'can' => [
                'create'                => $user->can(PermissionEnum::CREATE_POSITION->value),
                'edit'                  => $user->can(PermissionEnum::EDIT_POSITION->value),
                'delete'                => $user->can(PermissionEnum::DELETE_POSITION->value),
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد سمت جدید
     */
    public function create(Request $request)
    {
        $user = auth()->user();
        
        // لیست دپارتمان‌ها
        $query = Department::with('organization')->where('status', 'active');
        
        if ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id);
        }
        
        $departments = $query->get();
        
        $selectedDepartment = $request->department_id;
        
        return Inertia::render('positions/create', [
            'departments'               => $departments,
            'selectedDepartment'        => $selectedDepartment,
        ]);
    }

    /**
     * ذخیره سمت جدید
     */
    public function store(PositionRequest $request)
    {
        $user = auth()->user();
        
        // بررسی دسترسی به دپارتمان
        $department = Department::find($request->department_id);

        if (!$user->isSuperAdmin() && $user->organization_id != $department->organization_id) {
            abort(403, 'شما دسترسی ایجاد سمت در این دپارتمان را ندارید.');
        }
        
        // ایجاد سمت
        $position = Position::create([
            'department_id'             => $request->department_id,
            'name'                      => $request->name,
            'code'                      => Position::generateCode(),
            'level'                     => 10,
            'is_management'             => $request->is_management ?? false,
            'description'               => $request->description,
        ]);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'position_created',
            "سمت {$position->name} در دپارتمان {$department->name} ایجاد شد",
            $position
        );
        
        return redirect()->route('positions.index')
            ->with('success', 'سمت با موفقیت ایجاد شد.');
    }

    /**
     * نمایش جزئیات سمت
     */
    public function show(Position $position)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $position->department->organization_id) {
            abort(403);
        }
        
        $position->load([
            'department.organization',
            'users' => function ($q) {
                $q->withPivot('is_primary', 'start_date', 'end_date', 'status')
                  ->wherePivot('status', 'active')
                  ->limit(10);
            },
        ]);
        
        // آمار
        $stats = [
            'total_users'               => $position->users()->count(),
            'active_users'              => $position->users()->wherePivot('status', 'active')->count(),
            'primary_users'             => $position->users()->wherePivot('is_primary', true)->count(),
        ];
        
        return Inertia::render('positions/show', [
            'position'                  => $position,
            'stats'                     => $stats,
        ]);
    }

    /**
     * نمایش فرم ویرایش سمت
     */
    public function edit(Position $position)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $position->department->organization_id) {
            abort(403);
        }
        
        // لیست دپارتمان‌ها
        $query = Department::with('organization')->where('status', 'active');
        
        if ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id);
        }
        
        $departments = $query->get();
        
        return Inertia::render('positions/edit', [
            'position'                  => $position->load('department'),
            'departments'               => $departments,
        ]);
    }

    /**
     * به‌روزرسانی سمت
     */
    public function update(PositionRequest $request, Position $position)
    {
        $user = auth()->user();
        
        $oldName = $position->name;
        
        // به‌روزرسانی
        $position->update([
            'department_id'                 => $request->department_id,
            'name'                          => $request->name,
            'is_management'                 => $request->is_management ?? false,
            'description'                   => $request->description,
        ]);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'position_updated',
            "سمت {$oldName} به {$position->name} به‌روزرسانی شد",
            $position,
            ['old_name' => $oldName, 'new_name' => $position->name]
        );
        
        return redirect()->route('positions.index')
            ->with('success', 'سمت با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف سمت
     */
    public function destroy(Position $position)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $position->department->organization_id) {
            abort(403);
        }
        
        // بررسی وجود کاربر در این سمت
        if ($position->users()->count() > 0) {
            return back()->with('error', 'این سمت دارای کاربر است و قابل حذف نمی‌باشد.');
        }
        
        $positionName = $position->name;
        $departmentName = $position->department->name;
        $position->delete();
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'position_deleted',
            "سمت {$positionName} از دپارتمان {$departmentName} حذف شد",
            $position
        );
        
        return redirect()->route('positions.index')
            ->with('success', 'سمت با موفقیت حذف شد.');
    }
    
    /**
     * دریافت سمت‌ها برای API (برای select box)
     */
    public function getList(Request $request)
    {
        $user = auth()->user();
        $query = Position::select('id', 'name', 'code', 'department_id')
            ->with('department:id,name,organization_id');
        
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        
        // فیلتر بر اساس سازمان برای ادمین سازمان
        if ($user->isOrgAdmin()) {
            $query->whereHas('department', function ($q) use ($user) {
                $q->where('organization_id', $user->organization_id);
            });
        }
        
        if ($request->has('is_management')) {
            $query->where('is_management', $request->boolean('is_management'));
        }
        
        $positions = $query->orderBy('name')->get();
        
        return response()->json($positions);
    }
    
    /**
     * دریافت سمت‌های مدیریتی برای API
     */
    public function getManagementList(Request $request)
    {
        $user = auth()->user();
        $query = Position::select('id', 'name', 'code', 'department_id')
            ->with('department:id,name')
            ->where('is_management', true);
        
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        
        if ($user->isOrgAdmin()) {
            $query->whereHas('department', function ($q) use ($user) {
                $q->where('organization_id', $user->organization_id);
            });
        }
        
        $positions = $query->orderBy('name')->get();
        
        return response()->json($positions);
    }
}