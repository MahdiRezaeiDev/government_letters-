<?php
// app/Http/Controllers/TazkiraController.php

namespace App\Http\Controllers;

use App\Models\Tazkira;
use App\Models\TazkiraAttachment;
use App\Models\TazkiraReviewLog;
use App\Models\TazkiraReviewAttachment;
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
            ->with(['createdBy', 'approvedBy', 'attachments'])
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
            'filters' => $request->only(['search', 'status']),
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

        // آپلود تصویر اصلی تذکره
        if ($request->hasFile('tazkira_image')) {
            $imagePath = $request->file('tazkira_image')->store('tazkiras/main', 'public');
            $validated['tazkira_image'] = $imagePath;
        }

        $validated['created_by'] = auth()->id();

        DB::beginTransaction();
        try {
            $tazkira = Tazkira::create($validated);

            // آپلود ضمیمه‌های اضافی
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('tazkira/attachments/' . $tazkira->id, 'public');
                    TazkiraAttachment::create([
                        'tazkira_id' => $tazkira->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'description' => $request->attachment_description,
                        'uploaded_by' => auth()->id(),
                    ]);
                }
            }

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
                'edit' => auth()->user()->can('update', $tazkira),
                'delete' => auth()->user()->can('delete', $tazkira),
                'approve' => auth()->user()->can('approve', $tazkira),
            ],
        ]);
    }

    /**
     * فرم ویرایش تذکره
     */
    public function edit(Tazkira $tazkira)
    {
        $this->authorize('update', $tazkira);

        $tazkira->load('attachments');

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

        DB::beginTransaction();
        try {
            $tazkira->update($validated);

            // آپلود ضمیمه‌های جدید
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('tazkira/attachments/' . $tazkira->id, 'public');
                    TazkiraAttachment::create([
                        'tazkira_id' => $tazkira->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'description' => $request->attachment_description,
                        'uploaded_by' => auth()->id(),
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
        $this->authorize('delete', $tazkira);

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
        $this->authorize('approve', $tazkira);

        $request->validate([
            'note' => 'nullable|string|max:1000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240', // هر فایل حداکثر 10MB
        ]);

        DB::beginTransaction();
        try {
            // ثبت لاگ تأیید
            $reviewLog = TazkiraReviewLog::create([
                'tazkira_id' => $tazkira->id,
                'action' => 'approved',
                'note' => $request->note,
                'reviewed_by' => auth()->id(),
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
                        'file_type' => $file->getClientMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => auth()->id(),
                    ]);
                }
            }

            // به‌روزرسانی وضعیت تذکره
            $tazkira->update([
                'status' => 'approved',
                'approved_by' => auth()->id(),
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
        $this->authorize('approve', $tazkira);

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
                'reviewed_by' => auth()->id(),
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
                        'file_type' => $file->getClientMimeType(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'uploaded_by' => auth()->id(),
                    ]);
                }
            }

            // به‌روزرسانی وضعیت تذکره
            $tazkira->update([
                'status' => 'rejected',
                'approved_by' => auth()->id(),
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
        $request->validate([
            'attachments' => 'required|array',
            'attachments.*' => 'file|max:20480', // 20MB max
            'description' => 'nullable|string|max:500',
        ]);

        $attachments = [];

        foreach ($request->file('attachments') as $file) {
            $path = $file->store('tazkira/attachments/' . $tazkira->id, 'public');
            $attachment = TazkiraAttachment::create([
                'tazkira_id' => $tazkira->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientMimeType(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'description' => $request->description,
                'uploaded_by' => auth()->id(),
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
        $this->authorize('update', $attachment->tazkira);

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
            ->with(['createdBy', 'approvedBy', 'attachments'])
            ->first();

        if (!$tazkira) {
            return response()->json(['message' => 'تذکره یافت نشد'], 404);
        }

        return response()->json($tazkira);
    }
}
