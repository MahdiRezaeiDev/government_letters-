<?php
// app/Http/Controllers/TazkiraController.php

namespace App\Http\Controllers;

use App\Models\Tazkira;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class TazkiraController extends Controller
{
    /**
     * نمایش لیست تذکره‌ها
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Tazkira::query()
            ->with(['createdBy', 'approvedBy'])
            ->orderBy('created_at', 'desc');

        // فیلتر بر اساس وضعیت
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // جستجو
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('father_name', 'like', "%{$search}%")
                    ->orWhere('tazkira_number', 'like', "%{$search}%")
                    ->orWhere('national_code', 'like', "%{$search}%");
            });
        }

        // محدودیت دسترسی
        if (!$user->isSuperAdmin() && !$user->isOrgAdmin()) {
            $query->where('created_by', $user->id);
        }

        $tazkiras = $query->paginate(15);

        return Inertia::render('tazkira/index', [
            'tazkiras' => $tazkiras,
            'filters' => $request->only(['status', 'search']),
            'can' => [
                'create' => $user->can('create', Tazkira::class),
                'edit' => $user->can('update', Tazkira::class),
                'delete' => $user->can('delete', Tazkira::class),
                'approve' => $user->can('approve', Tazkira::class),
            ],
        ]);
    }

    /**
     * فرم ایجاد تذکره جدید
     */
    public function create()
    {
        return Inertia::render('tazkira/form', [
            'isEdit' => false,
        ]);
    }

    /**
     * ذخیره تذکره جدید
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // معلومات شخصی
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'father_name' => 'nullable|string|max:100',
            'grandfather_name' => 'nullable|string|max:100',

            // مشخصات تذکره
            'tazkira_number' => 'required|string|max:50|unique:tazkiras',
            'volume' => 'nullable|string|max:20',
            'page' => 'nullable|string|max:20',
            'registration_number' => 'nullable|string|max:50',

            // اطلاعات تکمیلی
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:200',
            'national_code' => 'nullable|string|max:20|unique:tazkiras',
            'father_card_number' => 'nullable|string|max:50',

            // اطلاعات تماس
            'phone' => 'nullable|string|max:20',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'email' => 'nullable|email|max:100',

            // وضعیت
            'status' => 'in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        // آپلود تصویر تذکره
        if ($request->hasFile('tazkira_image')) {
            $imagePath = $request->file('tazkira_image')->store('tazkiras', 'public');
            $validated['tazkira_image'] = $imagePath;
        }

        $validated['created_by'] = auth()->id();

        DB::beginTransaction();
        try {
            $tazkira = Tazkira::create($validated);
            DB::commit();

            return redirect()->route('tazkira.show', $tazkira)
                ->with('success', 'تذکره با موفقیت ثبت شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در ثبت تذکره: ' . $e->getMessage());
        }
    }

    /**
     * نمایش جزئیات یک تذکره
     */
    public function show(Tazkira $tazkira)
    {
        $tazkira->load(['createdBy', 'approvedBy']);

        return Inertia::render('tazkira/show', [
            'tazkira' => $tazkira,
        ]);
    }

    /**
     * فرم ویرایش تذکره
     */
    public function edit(Tazkira $tazkira)
    {
        $this->authorize('update', $tazkira);

        return Inertia::render('tazkira/form', [
            'tazkira' => $tazkira,
            'isEdit' => true,
        ]);
    }

    /**
     * بروزرسانی تذکره
     */
    public function update(Request $request, Tazkira $tazkira)
    {
        $this->authorize('update', $tazkira);

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'father_name' => 'nullable|string|max:100',
            'grandfather_name' => 'nullable|string|max:100',
            'tazkira_number' => 'required|string|max:50|unique:tazkiras,tazkira_number,' . $tazkira->id,
            'volume' => 'nullable|string|max:20',
            'page' => 'nullable|string|max:20',
            'registration_number' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:200',
            'national_code' => 'nullable|string|max:20|unique:tazkiras,national_code,' . $tazkira->id,
            'father_card_number' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'email' => 'nullable|email|max:100',
            'status' => 'in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('tazkira_image')) {
            // حذف تصویر قبلی
            if ($tazkira->tazkira_image) {
                Storage::disk('public')->delete($tazkira->tazkira_image);
            }
            $imagePath = $request->file('tazkira_image')->store('tazkiras', 'public');
            $validated['tazkira_image'] = $imagePath;
        }

        DB::beginTransaction();
        try {
            $tazkira->update($validated);
            DB::commit();

            return redirect()->route('tazkira.show', $tazkira)
                ->with('success', 'تذکره با موفقیت بروزرسانی شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در بروزرسانی تذکره: ' . $e->getMessage());
        }
    }

    /**
     * حذف تذکره
     */
    public function destroy(Tazkira $tazkira)
    {
        $this->authorize('delete', $tazkira);

        DB::beginTransaction();
        try {
            if ($tazkira->tazkira_image) {
                Storage::disk('public')->delete($tazkira->tazkira_image);
            }
            $tazkira->delete();
            DB::commit();

            return redirect()->route('tazkira.index')
                ->with('success', 'تذکره با موفقیت حذف شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در حذف تذکره: ' . $e->getMessage());
        }
    }

    /**
     * تأیید تذکره
     */
    public function approve(Tazkira $tazkira)
    {
        $this->authorize('approve', $tazkira);

        DB::beginTransaction();
        try {
            $tazkira->update([
                'status' => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
            DB::commit();

            return redirect()->route('tazkira.show', $tazkira)
                ->with('success', 'تذکره با موفقیت تأیید شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در تأیید تذکره: ' . $e->getMessage());
        }
    }

    /**
     * رد تذکره
     */
    public function reject(Request $request, Tazkira $tazkira)
    {
        $this->authorize('approve', $tazkira);

        $request->validate([
            'notes' => 'required|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $tazkira->update([
                'status' => 'rejected',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
                'notes' => $request->notes,
            ]);
            DB::commit();

            return redirect()->route('tazkira.show', $tazkira)
                ->with('warning', 'تذکره رد شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در رد تذکره: ' . $e->getMessage());
        }
    }

    /**
     * جستجوی تذکره
     */
    public function search(Request $request)
    {
        $search = $request->get('q');

        $tazkiras = Tazkira::where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%")
            ->orWhere('tazkira_number', 'like', "%{$search}%")
            ->orWhere('national_code', 'like', "%{$search}%")
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'father_name', 'tazkira_number']);

        return response()->json($tazkiras);
    }

    /**
     * دریافت اطلاعات تذکره با شماره تذکره
     */
    public function getByNumber($tazkiraNumber)
    {
        $tazkira = Tazkira::where('tazkira_number', $tazkiraNumber)
            ->with(['createdBy', 'approvedBy'])
            ->first();

        if (!$tazkira) {
            return response()->json(['message' => 'تذکره یافت نشد'], 404);
        }

        return response()->json($tazkira);
    }
}
