<?php
// app/Http/Controllers/TazkiraController.php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Models\Tazkira;
use App\Models\TazkiraAttachment;
use App\Models\TazkiraReviewLog;
use App\Models\TazkiraReviewAttachment;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class TazkiraController extends Controller
{
    use AuthorizesRequests;
    /**
     * نمایش لیست تذکره‌ها
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $this->authorize('viewAny', Tazkira::class);

        $query = Tazkira::query()
            ->with(['createdBy', 'approvedBy', 'attachments'])
            ->orderBy('created_at', 'desc');

        // فیلتر بر اساس فیلدهای جداگانه
        if ($request->filled('first_name')) {
            $query->where('first_name', 'like', '%' . $request->first_name . '%');
        }
        if ($request->filled('last_name')) {
            $query->where('last_name', 'like', '%' . $request->last_name . '%');
        }
        if ($request->filled('father_name')) {
            $query->where('father_name', 'like', '%' . $request->father_name . '%');
        }
        if ($request->filled('grandfather_name')) {
            $query->where('grandfather_name', 'like', '%' . $request->grandfather_name . '%');
        }
        if ($request->filled('tazkira_number')) {
            $query->where('tazkira_number', 'like', '%' . $request->tazkira_number . '%');
        }
        if ($request->filled('volume')) {
            $query->where('volume', 'like', '%' . $request->volume . '%');
        }
        if ($request->filled('page')) {
            $query->where('page', 'like', '%' . $request->page . '%');
        }
        if ($request->filled('registration_number')) {
            $query->where('registration_number', 'like', '%' . $request->registration_number . '%');
        }
        if ($request->filled('velayat')) {
            $query->where('velayat', 'like', '%' . $request->velayat . '%');
        }
        if ($request->filled('volosvali')) {
            $query->where('volosvali', 'like', '%' . $request->volosvali . '%');
        }
        if ($request->filled('qaria')) {
            $query->where('qaria', 'like', '%' . $request->qaria . '%');
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // جستجوی عمومی (اختیاری)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('father_name', 'like', "%{$search}%")
                    ->orWhere('grandfather_name', 'like', "%{$search}%")
                    ->orWhere('tazkira_number', 'like', "%{$search}%")
                    ->orWhere('velayat', 'like', "%{$search}%")
                    ->orWhere('volosvali', 'like', "%{$search}%")
                    ->orWhere('qaria', 'like', "%{$search}%");
            });
        }

        // محدودیت دسترسی (در صورت نیاز فعال شود)
        // if (!$user->isSuperAdmin() && !$user->isOrgAdmin()) {
        //     $query->where('created_by', $user->id);
        // }

        $tazkiras = $query->paginate(15);

        // ارسال همه فیلترها برای حفظ در فرم
        $filters = $request->only([
            'first_name',
            'last_name',
            'father_name',
            'grandfather_name',
            'tazkira_number',
            'volume',
            'page',
            'registration_number',
            'velayat',
            'volosvali',
            'qaria',
            'status',
            'search'
        ]);

        return Inertia::render('tazkira/index', [
            'tazkiras' => $tazkiras,
            'filters' => $filters,
            'can' => [
                'create' => $user->can(PermissionEnum::NID_REGISTER),
                'edit' => $user->can(PermissionEnum::NID_REGISTER),
                'delete' => $user->can(PermissionEnum::NID_DESTROY),
                'approve' => $user->can(PermissionEnum::NID_APPROVE),
            ],
        ]);
    }

    /**
     * فرم ایجاد تذکره جدید
     */
    public function create()
    {
        $user = auth()->user();

        $this->authorize('create', Tazkira::class);

        return Inertia::render('tazkira/create', [
            'can' => [
                'create' => $user->can(PermissionEnum::NID_REGISTER),
            ],
        ]);
    }

    /**
     * ذخیره تذکره جدید
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        // بررسی دسترسی برای ثبت تذکره
        if (!$user->can(PermissionEnum::NID_REGISTER)) {
            abort(403, 'شما مجاز به ثبت تذکره نیستید.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'father_name' => 'nullable|string|max:100',
            'grandfather_name' => 'nullable|string|max:100',
            'tazkira_number' => 'required|string|max:50|unique:tazkiras',
            'volume' => 'nullable|string|max:20',
            'page' => 'nullable|string|max:20',
            'registration_number' => 'nullable|string|max:50',
            'velayat' => 'nullable|string|max:100',
            'volosvali' => 'nullable|string|max:100',
            'qaria' => 'nullable|string|max:100',
            'tazkira_image' => 'nullable|image|max:5120',
            'attachments.*' => 'nullable|file|max:10240',
        ]);

        DB::beginTransaction();
        try {
            // ذخیره در دیتابیس
            $tazkira = Tazkira::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'father_name' => $validated['father_name'] ?? null,
                'grandfather_name' => $validated['grandfather_name'] ?? null,
                'tazkira_number' => $validated['tazkira_number'],
                'volume' => $validated['volume'] ?? null,
                'page' => $validated['page'] ?? null,
                'registration_number' => $validated['registration_number'] ?? null,
                'velayat' => $validated['velayat'] ?? null,
                'volosvali' => $validated['volosvali'] ?? null,
                'qaria' => $validated['qaria'] ?? null,
                'created_by' => $user->id,
                'status' => 'pending',
            ]);

            // ذخیره تصویر اصلی
            if ($request->hasFile('tazkira_image')) {
                $path = $request->file('tazkira_image')->store('tazkiras/main', 'public');
                $tazkira->update(['tazkira_image' => $path]);
            }

            // ذخیره ضمیمه‌ها
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $filePath = $file->store('tazkira/attachments/' . $tazkira->id, 'public');

                    TazkiraAttachment::create([
                        'tazkira_id' => $tazkira->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $filePath,
                        'file_type' => $file->getMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => $user->id,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('tazkira.show', $tazkira->id)
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
        $user = auth()->user();

        $this->authorize('view', $tazkira);

        $tazkira->load([
            'createdBy',
            'approvedBy',
            'attachments.uploader',
            'reviewLogs.reviewer',
            'reviewLogs.attachments.uploader'
        ]);

        return Inertia::render('tazkira/show', [
            'tazkira' => $tazkira,
            'can' => [
                'edit' => $user->can(PermissionEnum::NID_REGISTER),
                'delete' => $user->can(PermissionEnum::NID_DESTROY),
                'approve' => $user->can(PermissionEnum::NID_APPROVE),
            ],
        ]);
    }

    /**
     * فرم ویرایش تذکره
     */
    public function edit(Tazkira $tazkira)
    {
        $user = auth()->user();
        $this->authorize('update', $tazkira);

        $tazkira->load('attachments');

        return Inertia::render('tazkira/edit', [
            'tazkira' => $tazkira,
            'can' => [
                'edit' => $user->can(PermissionEnum::NID_REGISTER),
                'delete' => $user->can(PermissionEnum::NID_DESTROY),
            ],
        ]);
    }

    /**
     * بروزرسانی تذکره
     */
    public function update(Request $request, Tazkira $tazkira)
    {
        $user = auth()->user();

        // بررسی دسترسی برای ویرایش
        if (!$user->can(PermissionEnum::NID_REGISTER)) {
            abort(403, 'شما مجاز به ویرایش تذکره نیستید.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'father_name' => 'nullable|string|max:100',
            'grandfather_name' => 'nullable|string|max:100',
            'tazkira_number' => 'required|string|max:50|unique:tazkiras,tazkira_number,' . $tazkira->id,
            'volume' => 'nullable|string|max:20',
            'page' => 'nullable|string|max:20',
            'registration_number' => 'nullable|string|max:50',
            'velayat' => 'nullable|string|max:100',
            'volosvali' => 'nullable|string|max:100',
            'qaria' => 'nullable|string|max:100',
            'status' => 'in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // آپلود تصویر اصلی جدید
            if ($request->hasFile('tazkira_image')) {
                if ($tazkira->tazkira_image) {
                    Storage::disk('public')->delete($tazkira->tazkira_image);
                }
                $imagePath = $request->file('tazkira_image')->store('tazkiras/main', 'public');
                $validated['tazkira_image'] = $imagePath;
            }

            // حذف تصویر اصلی
            if ($request->input('remove_image') == '1') {
                if ($tazkira->tazkira_image) {
                    Storage::disk('public')->delete($tazkira->tazkira_image);
                }
                $validated['tazkira_image'] = null;
            }

            // حذف ضمیمه‌های مشخص شده
            if ($request->has('remove_attachments')) {
                $removeIds = $request->remove_attachments;
                $attachmentsToRemove = TazkiraAttachment::whereIn('id', $removeIds)->get();

                foreach ($attachmentsToRemove as $attachment) {
                    Storage::disk('public')->delete($attachment->file_path);
                    $attachment->delete();
                }
            }

            $tazkira->update($validated);

            // آپلود ضمیمه‌های جدید
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('tazkira/attachments/' . $tazkira->id, 'public');
                    TazkiraAttachment::create([
                        'tazkira_id' => $tazkira->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => $user->id,
                    ]);
                }
            }

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
        $user = auth()->user();

        // بررسی دسترسی برای حذف
        if (!$user->can(PermissionEnum::NID_DESTROY)) {
            abort(403, 'شما مجاز به حذف تذکره نیستید.');
        }

        DB::beginTransaction();
        try {
            // حذف تصویر اصلی
            if ($tazkira->tazkira_image) {
                Storage::disk('public')->delete($tazkira->tazkira_image);
            }

            // حذف ضمیمه‌ها
            foreach ($tazkira->attachments as $attachment) {
                Storage::disk('public')->delete($attachment->file_path);
            }

            // حذف لاگ‌های بررسی و ضمیمه‌های آنها
            foreach ($tazkira->reviewLogs as $log) {
                foreach ($log->attachments as $att) {
                    Storage::disk('public')->delete($att->file_path);
                }
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
     * تأیید تذکره با گزارش و ضمیمه
     */
    public function approve(Request $request, Tazkira $tazkira)
    {
        $user = auth()->user();

        // بررسی دسترسی برای تأیید
        if (!$user->can(PermissionEnum::NID_APPROVE)) {
            abort(403, 'شما مجاز به تأیید تذکره نیستید.');
        }

        $request->validate([
            'note' => 'nullable|string|max:1000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240',
        ]);

        DB::beginTransaction();
        try {
            // ثبت لاگ تأیید
            $reviewLog = TazkiraReviewLog::create([
                'tazkira_id' => $tazkira->id,
                'action' => 'approved',
                'note' => $request->note,
                'reviewed_by' => $user->id,
                'reviewed_at' => now(),
            ]);

            // آپلود ضمیمه‌های تأیید
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('tazkira/reviews/' . $tazkira->id, 'public');
                    TazkiraReviewAttachment::create([
                        'review_log_id' => $reviewLog->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => $user->id,
                    ]);
                }
            }

            // به‌روزرسانی وضعیت تذکره
            $tazkira->update([
                'status' => 'approved',
                'approved_by' => $user->id,
                'approved_at' => now(),
                'notes' => $request->note ?? $tazkira->notes,
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
     * رد تذکره با گزارش و ضمیمه
     */
    public function reject(Request $request, Tazkira $tazkira)
    {
        $user = auth()->user();

        // بررسی دسترسی برای رد
        if (!$user->can(PermissionEnum::NID_APPROVE)) {
            abort(403, 'شما مجاز به رد تذکره نیستید.');
        }

        $request->validate([
            'note' => 'required|string|max:1000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240',
        ]);

        DB::beginTransaction();
        try {
            // ثبت لاگ رد
            $reviewLog = TazkiraReviewLog::create([
                'tazkira_id' => $tazkira->id,
                'action' => 'rejected',
                'note' => $request->note,
                'reviewed_by' => $user->id,
                'reviewed_at' => now(),
            ]);

            // آپلود ضمیمه‌های رد
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('tazkira/reviews/' . $tazkira->id, 'public');
                    TazkiraReviewAttachment::create([
                        'review_log_id' => $reviewLog->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => $user->id,
                    ]);
                }
            }

            // به‌روزرسانی وضعیت تذکره
            $tazkira->update([
                'status' => 'rejected',
                'approved_by' => $user->id,
                'approved_at' => now(),
                'notes' => $request->note,
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
     * اضافه کردن ضمیمه به تذکره
     */
    public function addAttachment(Request $request, Tazkira $tazkira)
    {
        $user = auth()->user();

        // بررسی دسترسی برای ویرایش
        if (!$user->can(PermissionEnum::NID_REGISTER)) {
            abort(403, 'شما مجاز به افزودن ضمیمه نیستید.');
        }

        $request->validate([
            'attachments' => 'required|array',
            'attachments.*' => 'file|max:20480',
            'description' => 'nullable|string|max:500',
        ]);

        $attachments = [];

        foreach ($request->file('attachments') as $file) {
            $path = $file->store('tazkira/attachments/' . $tazkira->id, 'public');
            $attachment = TazkiraAttachment::create([
                'tazkira_id' => $tazkira->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getMimeType(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'description' => $request->description,
                'uploaded_by' => $user->id,
            ]);

            $attachments[] = [
                'id' => $attachment->id,
                'file_name' => $attachment->file_name,
                'file_path' => $attachment->file_path,
                'file_url' => Storage::url($attachment->file_path),
                'file_size' => $attachment->file_size,
                'description' => $attachment->description,
                'created_at' => $attachment->created_at,
            ];
        }

        return response()->json([
            'success' => true,
            'attachments' => $attachments,
        ]);
    }

    /**
     * حذف ضمیمه تذکره
     */
    public function deleteAttachment(TazkiraAttachment $attachment)
    {
        $user = auth()->user();

        // بررسی دسترسی برای ویرایش
        if (!$user->can(PermissionEnum::NID_REGISTER)) {
            abort(403, 'شما مجاز به حذف ضمیمه نیستید.');
        }

        Storage::disk('public')->delete($attachment->file_path);
        $attachment->delete();

        return response()->json(['success' => true]);
    }

    /**
     * جستجوی تذکره
     */
    public function search(Request $request)
    {
        $search = $request->get('q');

        $tazkiras = Tazkira::where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%")
            ->orWhere('father_name', 'like', "%{$search}%")
            ->orWhere('grandfather_name', 'like', "%{$search}%")
            ->orWhere('tazkira_number', 'like', "%{$search}%")
            ->orWhere('velayat', 'like', "%{$search}%")
            ->orWhere('volosvali', 'like', "%{$search}%")
            ->orWhere('qaria', 'like', "%{$search}%")
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'father_name', 'grandfather_name', 'tazkira_number', 'velayat', 'volosvali', 'qaria']);

        return response()->json($tazkiras);
    }

    /**
     * دریافت اطلاعات تذکره با شماره تذکره
     */
    public function getByNumber($tazkiraNumber)
    {
        $tazkira = Tazkira::where('tazkira_number', $tazkiraNumber)
            ->with(['createdBy', 'approvedBy', 'attachments'])
            ->first();

        if (!$tazkira) {
            return response()->json(['message' => 'تذکره یافت نشد'], 404);
        }

        return response()->json($tazkira);
    }
}
