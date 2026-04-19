<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use App\Models\Department;
use App\Models\ArchivePermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Enums\PermissionEnum;

class ArchiveController extends Controller
{

    /**
     * نمایش لیست بایگانی‌ها (بر اساس دپارتمان)
     */
    public function index(Request $request)
    {
        $currentUser = auth()->user();
        $query = Archive::query()->with(['department', 'parent']);
        
        // فیلتر بر اساس دپارتمان (مهم)
        if ($currentUser->isSuperAdmin()) {
            // ادمین کل: همه بایگانی‌ها
            if ($request->has('department_id') && $request->department_id) {
                $query->where('department_id', $request->department_id);
            }
        } elseif ($currentUser->isOrgAdmin()) {
            // ادمین سازمان: بایگانی‌های دپارتمان‌های سازمان خودش
            $departmentIds = Department::where('organization_id', $currentUser->organization_id)
                ->pluck('id');
            $query->whereIn('department_id', $departmentIds);
        } elseif ($currentUser->isDeptManager()) {
            // مدیر دپارتمان: فقط بایگانی دپارتمان خودش
            $query->where('department_id', $currentUser->department_id);
        } else {
            // کاربر عادی: بایگانی‌هایی که به آنها دسترسی دارد
            $query->whereHas('permissions', function ($q) use ($currentUser) {
                $q->whereIn('position_id', $currentUser->positions()->pluck('id'));
            });
        }
        
        // فیلتر جستجو
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            });
        }
        
        $archives = $query->paginate(15);
        
        // لیست دپارتمان‌ها برای فیلتر (فقط برای ادمین‌ها)
        $departments = ($currentUser->isSuperAdmin() || $currentUser->isOrgAdmin())
            ? Department::where('status', 'active')->get()
            : collect();
        
        return Inertia::render('archives/index', [
            'archives' => $archives,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department_id']),
            'can' => [
                'create' => $currentUser->can(PermissionEnum::CREATE_CASE->value),
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد بایگانی جدید
     */
    public function create()
    {
        $currentUser = auth()->user();
        
        // تعیین دپارتمان‌های قابل انتخاب
        if ($currentUser->isSuperAdmin()) {
            $departments = Department::where('status', 'active')->get();
        } elseif ($currentUser->isOrgAdmin()) {
            $departments = Department::where('organization_id', $currentUser->organization_id)
                ->where('status', 'active')
                ->get();
        } elseif ($currentUser->isDeptManager()) {
            $departments = Department::where('id', $currentUser->department_id)->get();
        } else {
            $departments = collect();
        }
        
        // بایگانی‌های والد (برای ساختار درختی)
        $parentArchives = Archive::where('department_id', $currentUser->department_id)
            ->get();
        
        return Inertia::render('archives/create', [
            'departments' => $departments,
            'parentArchives' => $parentArchives,
        ]);
    }

    /**
     * ذخیره بایگانی جدید
     */
    public function store(Request $request)
    {
        $currentUser = auth()->user();
        
        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:archives,code',
            'parent_id' => 'nullable|exists:archives,id',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // بررسی دسترسی به دپارتمان
        $department = Department::find($request->department_id);
        if (!$currentUser->isSuperAdmin() && 
            !($currentUser->isOrgAdmin() && $currentUser->organization_id === $department->organization_id) &&
            $currentUser->department_id !== $department->id) {
            abort(403);
        }
        
        $archive = Archive::create([
            'department_id' => $request->department_id,
            'name' => $request->name,
            'code' => $request->code,
            'parent_id' => $request->parent_id,
            'description' => $request->description,
            'location' => $request->location,
            'is_active' => $request->is_active ?? true,
        ]);
        
        // لاگ عملیات
        \App\Models\EventLog::log(
            'archive_created',
            "بایگانی {$archive->name} در دپارتمان {$department->name} ایجاد شد",
            $archive
        );
        
        return redirect()->route('archives.index')
            ->with('success', 'بایگانی با موفقیت ایجاد شد.');
    }

    /**
     * نمایش جزئیات بایگانی
     */
    public function show(Archive $archive)
    {
        $currentUser = auth()->user();
        
        // بررسی دسترسی
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        $archive->load(['department', 'parent', 'children', 'cases']);
        
        // آمار
        $stats = [
            'total_cases' => $archive->cases()->count(),
            'active_cases' => $archive->cases()->where('is_active', true)->count(),
            'total_files' => $archive->cases()->withCount('letters')->get()->sum('letters_count'),
        ];
        
        return Inertia::render('Archives/Show', [
            'archive' => $archive,
            'stats' => $stats,
        ]);
    }

    /**
     * نمایش فرم ویرایش بایگانی
     */
    public function edit(Archive $archive)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        // دپارتمان‌های قابل انتخاب
        if ($currentUser->isSuperAdmin()) {
            $departments = Department::where('status', 'active')->get();
        } elseif ($currentUser->isOrgAdmin()) {
            $departments = Department::where('organization_id', $currentUser->organization_id)->get();
        } else {
            $departments = Department::where('id', $archive->department_id)->get();
        }
        
        $parentArchives = Archive::where('department_id', $archive->department_id)
            ->where('id', '!=', $archive->id)
            ->get();
        
        return Inertia::render('Archives/Edit', [
            'archive' => $archive,
            'departments' => $departments,
            'parentArchives' => $parentArchives,
        ]);
    }

    /**
     * به‌روزرسانی بایگانی
     */
    public function update(Request $request, Archive $archive)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:archives,code,' . $archive->id,
            'parent_id' => 'nullable|exists:archives,id|not_in:' . $archive->id,
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $archive->update([
            'department_id' => $request->department_id,
            'name' => $request->name,
            'code' => $request->code,
            'parent_id' => $request->parent_id,
            'description' => $request->description,
            'location' => $request->location,
            'is_active' => $request->is_active ?? true,
        ]);
        
        return redirect()->route('archives.show', $archive->id)
            ->with('success', 'بایگانی با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف بایگانی
     */
    public function destroy(Archive $archive)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        // بررسی وجود پرونده
        if ($archive->cases()->count() > 0) {
            return back()->with('error', 'این بایگانی دارای پرونده است و قابل حذف نمی‌باشد.');
        }
        
        $archive->delete();
        
        return redirect()->route('archives.index')
            ->with('success', 'بایگانی با موفقیت حذف شد.');
    }
    
    /**
     * مدیریت دسترسی‌های بایگانی
     */
    public function permissions(Archive $archive)
    {
        $currentUser = auth()->user();
        
        if (!$currentUser->isSuperAdmin() && !$currentUser->isOrgAdmin()) {
            abort(403);
        }
        
        $permissions = $archive->permissions()->with('position')->get();
        
        return Inertia::render('Archives/Permissions', [
            'archive' => $archive,
            'permissions' => $permissions,
        ]);
    }
    
    /**
     * بررسی دسترسی به بایگانی
     */
    private function canAccessArchive($user, Archive $archive): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $archive->department->organization_id;
        }
        if ($user->isDeptManager()) {
            return $user->department_id === $archive->department_id;
        }
        
        // کاربر عادی: بررسی دسترسی‌های تعریف شده
        return $archive->permissions()
            ->whereIn('position_id', $user->positions()->pluck('id'))
            ->exists();
    }
}