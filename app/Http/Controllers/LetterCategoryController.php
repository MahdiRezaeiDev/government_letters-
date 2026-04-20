<?php

namespace App\Http\Controllers;

use App\Models\LetterCategory;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LetterCategoryController extends Controller
{
    /**
     * نمایش لیست دسته‌بندی‌ها
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = LetterCategory::with(['parent', 'children']);
        
        // فیلتر بر اساس سازمان
        if ($user->isSuperAdmin() && $request->has('organization_id') && $request->organization_id) {
            $query->where('organization_id', $request->organization_id);
        } elseif ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id);
        } elseif (!$user->isSuperAdmin()) {
            // کاربران عادی فقط دسته‌بندی‌های سازمان خود را می‌بینند
            $query->where('organization_id', $user->organization_id);
        }
        
        // فیلتر جستجو
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            });
        }
        
        // فیلتر وضعیت
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }
        
        $categories = $query->orderBy('sort_order')->paginate(15);
        
        // سازمان‌ها برای فیلتر (فقط برای ادمین کل)
        $organizations = $user->isSuperAdmin() 
            ? Organization::where('status', 'active')->get() 
            : collect();
        
        return Inertia::render('categories/index', [
            'categories' => $categories,
            'organizations' => $organizations,
            'filters' => $request->only(['search', 'status', 'organization_id']),
            'can' => [
                'create' => $user->can('create-category'),
                'edit' => $user->can('edit-category'),
                'delete' => $user->can('delete-category'),
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد دسته‌بندی جدید
     */
    public function create()
    {
        $user = auth()->user();
        
        // تعیین سازمان‌های قابل انتخاب
        if ($user->isSuperAdmin()) {
            $organizations = Organization::where('status', 'active')->get();
        } else {
            $organizations = Organization::where('id', $user->organization_id)
                ->where('status', 'active')
                ->get();
        }
        
        // دسته‌بندی‌های والد (همان سازمان)
        $parentCategories = collect();
        if ($organizations->isNotEmpty()) {
            $parentCategories = LetterCategory::where('organization_id', $organizations->first()->id)
                ->where('status', true)
                ->orderBy('sort_order')
                ->get();
        }
        
        return Inertia::render('categories/create', [
            'organizations' => $organizations,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * ذخیره دسته‌بندی جدید
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:letter_categories,code',
            'parent_id' => 'nullable|exists:letter_categories,id',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7|regex:/^#[a-fA-F0-9]{6}$/',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // بررسی دسترسی به سازمان
        if (!$user->isSuperAdmin() && $user->organization_id != $request->organization_id) {
            abort(403);
        }
        
        $category = LetterCategory::create([
            'organization_id' => $request->organization_id,
            'name' => $request->name,
            'code' => $request->code,
            'parent_id' => $request->parent_id,
            'description' => $request->description,
            'color' => $request->color ?? '#3b82f6',
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status ?? true,
        ]);
        
        return redirect()->route('categories.index')
            ->with('success', 'دسته‌بندی با موفقیت ایجاد شد.');
    }

    /**
     * نمایش جزئیات دسته‌بندی
     */
    public function show(LetterCategory $category)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if (!$user->isSuperAdmin() && $user->organization_id != $category->organization_id) {
            abort(403);
        }
        
        $category->load(['parent', 'children', 'organization']);
        
        // آمار نامه‌های این دسته‌بندی
        $stats = [
            'total_letters' => $category->letters()->count(),
            'active_letters' => $category->letters()->where('final_status', 'approved')->count(),
            'pending_letters' => $category->letters()->where('final_status', 'pending')->count(),
        ];
        
        return Inertia::render('categories/show', [
            'category' => $category,
            'stats' => $stats,
            'can' => [
                'create' => $user->can('create-department'),
                'edit' => $user->can('edit-department'),
                'delete' => $user->can('delete-department'),
            ],
        ]);
    }

    /**
     * نمایش فرم ویرایش دسته‌بندی
     */
    public function edit(LetterCategory $category)
    {
        $user = auth()->user();
        
        if (!$user->isSuperAdmin() && $user->organization_id != $category->organization_id) {
            abort(403);
        }
        
        // سازمان‌های قابل انتخاب
        if ($user->isSuperAdmin()) {
            $organizations = Organization::where('status', 'active')->get();
        } else {
            $organizations = Organization::where('id', $user->organization_id)->get();
        }
        
        // دسته‌بندی‌های والد (به جز خودش)
        $parentCategories = LetterCategory::where('organization_id', $category->organization_id)
            ->where('id', '!=', $category->id)
            ->orderBy('sort_order')
            ->get();
        
        return Inertia::render('categories/edit', [
            'category' => $category,
            'organizations' => $organizations,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * به‌روزرسانی دسته‌بندی
     */
    public function update(Request $request, LetterCategory $category)
    {
        $user = auth()->user();
        
        if (!$user->isSuperAdmin() && $user->organization_id != $category->organization_id) {
            abort(403);
        }
        
        $validator = Validator::make($request->all(), [
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:letter_categories,code,' . $category->id,
            'parent_id' => 'nullable|exists:letter_categories,id|not_in:' . $category->id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7|regex:/^#[a-fA-F0-9]{6}$/',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $category->update([
            'organization_id' => $request->organization_id,
            'name' => $request->name,
            'code' => $request->code,
            'parent_id' => $request->parent_id,
            'description' => $request->description,
            'color' => $request->color ?? '#3b82f6',
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status ?? true,
        ]);
        
        return redirect()->route('categories.index')
            ->with('success', 'دسته‌بندی با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف دسته‌بندی
     */
    public function destroy(LetterCategory $category)
    {
        $user = auth()->user();
        
        if (!$user->isSuperAdmin() && $user->organization_id != $category->organization_id) {
            abort(403);
        }
        
        // بررسی وجود زیردسته
        if ($category->children()->count() > 0) {
            return back()->with('error', 'این دسته‌بندی دارای زیردسته است و قابل حذف نمی‌باشد.');
        }
        
        // بررسی وجود نامه در این دسته
        if ($category->letters()->count() > 0) {
            return back()->with('error', 'این دسته‌بندی دارای نامه است و قابل حذف نمی‌باشد.');
        }
        
        $category->delete();
        
        return redirect()->route('categories.index')
            ->with('success', 'دسته‌بندی با موفقیت حذف شد.');
    }
    
    /**
     * تغییر وضعیت دسته‌بندی
     */
    public function toggleStatus(LetterCategory $category)
    {
        $user = auth()->user();
        
        if (!$user->isSuperAdmin() && $user->organization_id != $category->organization_id) {
            abort(403);
        }
        
        $category->update(['status' => !$category->status]);
        
        return back()->with('success', 'وضعیت دسته‌بندی با موفقیت تغییر کرد.');
    }
    
    /**
     * دریافت دسته‌بندی‌ها برای API (برای select box)
     */
    public function getList(Request $request)
    {
        $user = auth()->user();
        $query = LetterCategory::select('id', 'name', 'code', 'organization_id')
            ->with('organization:id,name')
            ->where('status', true);
        
        if ($request->has('organization_id')) {
            $query->where('organization_id', $request->organization_id);
        } elseif ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id);
        }
        
        $categories = $query->orderBy('sort_order')->get();
        
        return response()->json($categories);
    }
}