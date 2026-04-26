<?php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    /**
     * نمایش لیست سازمان‌ها
     */
    public function index(Request $request)
    {
        $currentUser = auth()->user();
        $query = Organization::query()
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('code', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            });

        $organizations = $query->with('parent')->paginate(15);

        return Inertia::render('organizations/index', [
            'organizations' => $organizations,
            'filters' => $request->only(['search', 'status']),
            'can' => [
                "create" => $currentUser->can(PermissionEnum::CREATE_ORGANIZATION),
                "edit" => $currentUser->can(PermissionEnum::EDIT_ORGANIZATION),
                "delete" => $currentUser->can(PermissionEnum::DELETE_ORGANIZATION)
            ]
        ]);
    }

    /**
     * نمایش فرم ایجاد سازمان جدید
     */
    public function create()
    {
        if (!auth()->user()->can(PermissionEnum::CREATE_ORGANIZATION)) {
            abort(403, 'شما دسترسی ایجاد سازمان را ندارید.');
        }
        return Inertia::render('organizations/create');
    }

    /**
     * ذخیره سازمان جدید
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:organizations,code',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('organizations/logos', 'public');
        }

        $organization = Organization::create([
            'name' => $request->name,
            'code' => $request->code,
            'logo' => $logoPath,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'website' => $request->website,
            'status' => $request->status,
        ]);

        return redirect()->route('organizations.index')
            ->with('success', 'سازمان با موفقیت ایجاد شد.');
    }
    /**
     * نمایش جزئیات سازمان
     */
    public function show(Organization $organization)
    {
        $organization->load([
            'departments' => function ($q) {
                $q->withCount('users');
            },
        ]);

        // آمار
        $stats = [
            'total_departments' => $organization->departments->count(),
            'total_users' => User::where('organization_id', $organization->id)->count(),
            'active_departments' => $organization->departments->where('status', 'active')->count(),
        ];

        return Inertia::render('organizations/show', [
            'organization' => $organization,
            'stats' => $stats,
            'can' => [
                'edit' => true,
                'delete' => true
            ],
        ]);
    }

    /**
     * نمایش فرم ویرایش سازمان
     */
    public function edit(Organization $organization)
    {
        $organization->logo_url = $organization->logo
            ? Storage::url($organization->logo)
            : null;

        return Inertia::render('organizations/edit', [
            'organization' => $organization,
        ]);
    }

    /**
     * به‌روزرسانی سازمان
     */
    public function update(Request $request, Organization $organization)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:organizations,code,' . $organization->id,
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // پردازش لوگو
        if ($request->hasFile('logo')) {
            // حذف لوگوی قدیمی
            if ($organization->logo && Storage::disk('public')->exists($organization->logo)) {
                Storage::disk('public')->delete($organization->logo);
            }

            $logoPath = $request->file('logo')->store('organizations/logos', 'public');
            $organization->logo = $logoPath;
        }

        // حذف لوگو اگر درخواست شده باشد
        if ($request->has('remove_logo') && $request->remove_logo === 'true') {
            if ($organization->logo && Storage::disk('public')->exists($organization->logo)) {
                Storage::disk('public')->delete($organization->logo);
            }
            $organization->logo = null;
        }

        $organization->update([
            'name' => $request->name,
            'code' => $request->code,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'website' => $request->website,
            'status' => $request->status,
        ]);

        return redirect()->route('organizations.index')
            ->with('success', 'سازمان با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف سازمان (soft delete)
     */
    public function destroy(Organization $organization)
    {
        // بررسی وجود دپارتمان
        if ($organization->departments()->count() > 0) {
            return back()->with('error', 'این سازمان دارای دپارتمان است و قابل حذف نمی‌باشد.');
        }

        // بررسی وجود کاربر
        if ($organization->users()->count() > 0) {
            return back()->with('error', 'این سازمان دارای کاربر است و قابل حذف نمی‌باشد.');
        }

        $organizationName = $organization->name;
        $organization->delete();

        // لاگ عملیات
        \App\Models\EventLog::log(
            'organization_deleted',
            "سازمان {$organizationName} حذف شد",
            $organization
        );

        return redirect()->route('organizations.index')
            ->with('success', 'سازمان با موفقیت حذف شد.');
    }

    /**
     * تغییر وضعیت سازمان (فعال/غیرفعال)
     */
    public function toggleStatus(Organization $organization)
    {
        $newStatus = $organization->status === 'active' ? 'inactive' : 'active';
        $organization->update(['status' => $newStatus]);

        return back()->with('success', 'وضعیت سازمان با موفقیت تغییر کرد.');
    }

    /**
     * دریافت سازمان‌ها برای API (برای select box)
     */
    public function getList(Request $request)
    {
        $organizations = Organization::select('id', 'name', 'code')
            ->when($request->has('status'), function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->orderBy('name')
            ->get();

        return response()->json($organizations);
    }
}
