<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\User;
use App\Models\Position;
use App\Models\Department;
use App\Models\Attachment;
use App\Models\Routing;
use App\Models\LetterHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Enums\PermissionEnum;
use App\Http\Requests\LetterRequest;
use App\Models\Organization;
use App\Services\LetterService;
use Illuminate\Support\Facades\Auth;

class LetterController extends Controller
{
    protected LetterService $letterService;

    public function __construct(LetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    /**
     * نمایش لیست نامه‌ها (بر اساس سطح دسترسی)
     */
    public function index(Request $request)
    {
        $currentUser = auth()->user();
        $query = Letter::query()
            ->with([
                'category',
                'createdBy',
                'senderDepartment',
                'recipientDepartment',
                'routings' => function ($query) {
                    $query->where('to_user_id', auth()->id())
                        ->orWhere('to_user_id', null);
                }
            ]);

        // ============================================
        // فیلتر بر اساس سطح دسترسی (مهم)
        // ============================================

        if ($currentUser->isSuperAdmin()) {
            // ادمین کل: همه نامه‌ها
            if ($request->has('organization_id') && $request->organization_id) {
                $query->where('organization_id', $request->organization_id);
            }
        } elseif ($currentUser->isOrgAdmin()) {
            // ادمین سازمان: نامه‌های سازمان خودش
            $query->where('organization_id', $currentUser->organization_id);
        } elseif ($currentUser->isDeptManager()) {
            // مدیر دپارتمان: نامه‌های دپارتمان خودش
            $query->where(function ($query) use ($currentUser) {
                $query->where('sender_department_id', $currentUser->department_id)
                    ->orWhere('recipient_department_id', $currentUser->department_id);
            });
        } else {
            // کاربر عادی: نامه‌هایی که خودش ایجاد کرده یا به او ارجاع شده
            $query->where(function ($q) use ($currentUser) {
                $q->where('created_by', $currentUser->id)
                    ->orWhere('sender_user_id', $currentUser->id)
                    ->orWhere('recipient_user_id', $currentUser->id)
                    ->orWhereHas('routings', function ($r) use ($currentUser) {
                        $r->where('to_user_id', $currentUser->id);
                    });
            });
        }

        // ============================================
        // فیلترهای مختلف
        // ============================================

        // فیلتر نوع نامه
        if ($request->has('letter_type') && in_array($request->letter_type, ['incoming', 'outgoing', 'internal'])) {
            $query->where('letter_type', $request->letter_type);
        }

        // فیلتر وضعیت
        if ($request->has('status') && in_array($request->status, ['draft', 'pending', 'approved', 'rejected', 'archived'])) {
            $query->where('final_status', $request->status);
        }

        // فیلتر اولویت
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // فیلتر جستجو
        if ($request->has('search') && $request->search) {
            $query->where(function ($query) use ($request) {
                $query->where('subject', 'like', "%{$request->search}%")
                    ->orWhere('letter_number', 'like', "%{$request->search}%")
                    ->orWhere('tracking_number', 'like', "%{$request->search}%")
                    ->orWhere('content', 'like', "%{$request->search}%");
            });
        }

        // فیلتر تاریخ
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $letters = $query->orderBy('created_at', 'desc')->paginate(15);

        // لیست دسته‌بندی‌ها برای فیلتر
        $categories = LetterCategory::where('organization_id', $currentUser->organization_id)
            ->where('status', true)
            ->get();

        return Inertia::render('letters/index', [
            'letters' => $letters,
            'categories' => $categories,
            'filters' => $request->only(['search', 'letter_type', 'status', 'priority', 'date_from', 'date_to']),
            'can' => [
                'create' => $currentUser->can('create-letter'),
                'edit' => $currentUser->can('edit-letter'),
                'delete' => $currentUser->can('delete-letter'),
            ],
            'types' => [
                'incoming' => 'نامه وارده',
                'outgoing' => 'نامه صادره',
                'internal' => 'نامه داخلی',
            ],
            'statuses' => [
                'draft' => 'پیش‌نویس',
                'pending' => 'در انتظار',
                'approved' => 'تایید شده',
                'rejected' => 'رد شده',
                'archived' => 'بایگانی شده',
            ],
            'priorities' => [
                'low' => 'کم',
                'normal' => 'عادی',
                'high' => 'مهم',
                'urgent' => 'فوری',
                'very_urgent' => 'خیلی فوری',
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد نامه جدید
     */
    public function create(Request $request)
    {
        $currentUser = auth()->user();

        $type = $request->query('type', 'incoming');

        // دسته‌بندی‌ها
        $categories = LetterCategory::where('organization_id', $currentUser->organization_id)
            ->where('status', true)
            ->orderBy('sort_order')
            ->get();

        // کاربران سازمان (برای انتخاب فرستنده/گیرنده)
        $users = User::where('organization_id', $currentUser->organization_id)
            ->where('status', 'active')
            ->where('id', '!=', $currentUser->id)
            ->with(['primaryPosition', 'department'])
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->full_name,
                'position' => $user->primaryPosition?->name,
                'department' => $user->department?->name,
            ]);

        // دپارتمان‌ها
        $departments = Department::where('organization_id', $currentUser->organization_id)
            ->where('status', 'active')
            ->get(['id', 'name']);

        // پست‌ها
        // LetterController.php - متد create()

        $positions = Position::whereHas('department', function ($q) use ($currentUser) {
            $q->where('organization_id', $currentUser->organization_id);
        })
            ->with(['users:id,first_name,last_name'])
            ->get(['id', 'name', 'department_id'])
            ->map(fn($p) => [
                'id'            => $p->id,
                'name'          => $p->name,
                'department_id' => $p->department_id,
                'user_id'       => $p->users->first()?->id,
                'user_name'     => $p->users->first()?->full_name,
            ]);

        // دریافت سازمان‌های خارجی (به جز سازمان خود کاربر)
        $externalOrganizations = Organization::where('id', '!=', $currentUser->organization_id)
            ->where('status', 'active')
            ->get(['id', 'name', 'code']);

        return Inertia::render('letters/create', [
            'type' => $type,
            'categories' => $categories,
            'users' => $users,
            'departments' => $departments,
            'positions' => $positions,
            'can' => [
                'create' => $currentUser->can('create-letter-in-org'),
                'edit' => $currentUser->can('edit-letter-in-org'),
                'delete' => $currentUser->can('delete-letter-in-org'),
            ],
            'externalOrganizations' => $externalOrganizations,
            'securityLevels' => config('correspondence.security_levels'),
            'priorityLevels' => config('correspondence.priority_levels'),
        ]);
    }

    /**
     * ذخیره نامه جدید
     */
    public function store(LetterRequest $request)
    {
        dd($request->validated());
        
        try {
            $currentUser = Auth::user()->load(['primaryPosition', 'department']);

            $letter = $this->letterService->createLetter(
                $request->validated(),
                $currentUser
            );

            $message = $letter->is_draft
                ? 'پیش‌نویس مکتوب با موفقیت ذخیره شد.'
                : 'مکتوب با موفقیت ثبت گردید.';

            return redirect()
                ->route('letters.show', $letter->id)
                ->with('success', $message);
        } catch (\Exception $e) {
            return back()
                ->with('error', 'خطا در ثبت مکتوب: ' . $e->getMessage())
                ->withInput();
        }
    }
    /**
     * نمایش جزئیات نامه
     */
    public function show(Letter $letter)
    {
        $currentUser = auth()->user();

        // بررسی دسترسی
        if (!$this->canViewLetter($currentUser, $letter)) {
            abort(403);
        }

        $letter->load([
            'category',
            'createdBy',
            'senderUser',
            'recipientUser',
            'senderDepartment',
            'recipientDepartment',
            'routings' => function ($q) {
                $q->with(['fromUser', 'toUser', 'fromPosition', 'toPosition']);
            },
            'histories' => function ($q) {
                $q->with('user')->latest()->limit(20);
            },
            'attachments',
            'cases',
        ]);

        // ثبت مشاهده
        $letter->views()->create([
            'user_id' => $currentUser->id,
            'viewed_at' => now(),
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('letters/show', [
            'letter' => $letter,
            'securityLevels' => [
                'public' => 'عمومی',
                'internal' => 'داخلی',
                'confidential' => 'محرمانه',
                'secret' => 'سری',
                'top_secret' => 'بسیار سری',
            ],
            'priorityLevels' => [
                'low' => 'کم',
                'normal' => 'عادی',
                'high' => 'مهم',
                'urgent' => 'فوری',
                'very_urgent' => 'خیلی فوری',
            ],
            'can' => [
                'edit' => $currentUser->can(PermissionEnum::EDIT_LETTER->value),
                'delete' => $currentUser->can(PermissionEnum::DELETE_LETTER->value),
                'archive' => $currentUser->can(PermissionEnum::ARCHIVE_LETTER->value),
                'route' => $currentUser->can(PermissionEnum::ROUTE_LETTER->value),
                'approve' => $currentUser->can(PermissionEnum::APPROVE_LETTER->value),
            ],
        ]);
    }

    /**
     * نمایش فرم ویرایش نامه
     */
    public function edit(Letter $letter)
    {
        $currentUser = auth()->user();

        // فقط پیش‌نویس و ایجادکننده می‌تواند ویرایش کند
        if (!$letter->is_draft || $letter->created_by != $currentUser->id) {
            abort(403);
        }

        $categories = LetterCategory::where('organization_id', $currentUser->organization_id)
            ->where('status', true)
            ->orderBy('sort_order')
            ->get();

        $users = User::where('organization_id', $currentUser->organization_id)
            ->where('status', 'active')
            ->with(['primaryPosition', 'department'])
            ->get();

        return Inertia::render('letters/edit', [
            'letter' => $letter,
            'categories' => $categories,
            'users' => $users,
            'securityLevels' => [
                'public' => 'عمومی',
                'internal' => 'داخلی',
                'confidential' => 'محرمانه',
                'secret' => 'سری',
                'top_secret' => 'بسیار سری',
            ],
            'priorityLevels' => [
                'low' => 'کم',
                'normal' => 'عادی',
                'high' => 'مهم',
                'urgent' => 'فوری',
                'very_urgent' => 'خیلی فوری',
            ],
        ]);
    }

    /**
     * به‌روزرسانی نامه
     */
    public function update(Request $request, Letter $letter)
    {
        $currentUser = auth()->user();

        if (!$letter->is_draft || $letter->created_by !== $currentUser->id) {
            abort(403);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'nullable|exists:letter_categories,id',
            'subject' => 'required|string|max:500',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'priority' => 'required|in:low,normal,high,urgent,very_urgent',
            'date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:date',
            'sheet_count' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $letter->update([
            'category_id' => $request->category_id,
            'subject' => $request->subject,
            'summary' => $request->summary,
            'content' => $request->content,
            'security_level' => $request->security_level,
            'priority' => $request->priority,
            'date' => $request->date,
            'due_date' => $request->due_date,
            'sheet_count' => $request->sheet_count,
        ]);

        return redirect()->route('letters.show', $letter->id)
            ->with('success', 'نامه با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف نامه
     */
    public function destroy(Letter $letter)
    {
        $currentUser = auth()->user();

        if (!$currentUser->can(PermissionEnum::DELETE_LETTER->value)) {
            abort(403);
        }

        $letter->delete();

        return redirect()->route('letters.index')
            ->with('success', 'نامه با موفقیت حذف شد.');
    }

    /**
     * انتشار پیش‌نویس (تبدیل به نامه واقعی)
     */
    public function publish(Letter $letter)
    {
        $currentUser = auth()->user();

        if (!$letter->is_draft || $letter->created_by !== $currentUser->id) {
            abort(403);
        }

        DB::beginTransaction();

        try {
            $letter->update([
                'is_draft' => false,
                'letter_number' => $this->generateLetterNumber($letter->letter_type),
                'final_status' => 'pending',
            ]);

            // ایجاد ارجاع
            if ($letter->recipient_user_id) {
                $this->createRouting($letter, $letter->recipient_user_id);
            }

            LetterHistory::create([
                'letter_id' => $letter->id,
                'action_type' => 'published',
                'user_id' => $currentUser->id,
                'ip_address' => request()->ip(),
            ]);

            DB::commit();

            return redirect()->route('letters.show', $letter->id)
                ->with('success', 'نامه با موفقیت منتشر شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در انتشار نامه: ' . $e->getMessage());
        }
    }

    public function downloadAttachment(Attachment $attachment)
    {
        // dd($attachment->file_path);

        if (!Storage::disk('public')->exists($attachment->file_path)) {
            return back()->with('error', 'فایل یافت نشد.');
        }

        $attachment->incrementDownloadCount();

        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }

    public function preview(Attachment $attachment)
    {
        // if (!Storage::disk($attachment->disk)->exists($attachment->file_path)) {
        //     abort(404);
        // }

        return Storage::disk('public')->response(
            $attachment->file_path,
            $attachment->file_name,
            [
                'Content-Type' => $attachment->mime_type,
            ]
        );
    }

    // ============================================
    // متدهای کمکی (Helpers)
    // ============================================

    private function generateLetterNumber($type): string
    {
        $year = now()->format('Y');
        $month = now()->format('m');

        $typeCodes = [
            'incoming' => 'IN',
            'outgoing' => 'OUT',
            'internal' => 'INT',
        ];

        $code = $typeCodes[$type] ?? strtoupper(substr($type, 0, 3));

        $lastLetter = Letter::where('letter_type', $type)
            ->whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastLetter ? intval(substr($lastLetter->letter_number, -5)) + 1 : 1;

        return sprintf("%s/%s/%s/%05d", $code, $year, $month, $sequence);
    }

    private function createRouting(Letter $letter, int $toUserId, ?string $instruction = null): void
    {
        Routing::create([
            'letter_id' => $letter->id,
            'from_user_id' => auth()->id(),
            'to_user_id' => $toUserId,
            'action_type' => $letter->letter_type === 'incoming' ? 'action' : 'approval',
            'instruction' => $instruction ?? 'لطفاً بررسی و اقدام لازم انجام شود.',
            'deadline' => now()->addDays(7),
            'status' => 'pending',
            'step_order' => 1,
        ]);
    }

    private function canViewLetter($user, Letter $letter): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $letter->organization_id;
        }
        if ($user->isDeptManager()) {
            return $user->department_id === $letter->sender_department_id ||
                $user->department_id === $letter->recipient_department_id;
        }
        return $user->id === $letter->created_by ||
            $user->id === $letter->sender_user_id ||
            $user->id === $letter->recipient_user_id ||
            $letter->routings()->where('to_user_id', $user->id)->exists();
    }
}
