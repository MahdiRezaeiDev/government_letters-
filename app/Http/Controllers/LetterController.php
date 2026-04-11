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
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Enums\PermissionEnum;

class LetterController extends Controller
{
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
                'routings' => function ($q) {
                    $q->where('to_user_id', auth()->id())
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
            $query->where(function ($q) use ($currentUser) {
                $q->where('sender_department_id', $currentUser->department_id)
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
            $query->where(function ($q) use ($request) {
                $q->where('subject', 'like', "%{$request->search}%")
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
        
        return Inertia::render('Letters/Index', [
            'letters' => $letters,
            'categories' => $categories,
            'filters' => $request->only(['search', 'letter_type', 'status', 'priority', 'date_from', 'date_to']),
            'can' => [
                'create' => $currentUser->can(PermissionEnum::CREATE_LETTER->value),
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
        $positions = Position::whereHas('department', function ($q) use ($currentUser) {
            $q->where('organization_id', $currentUser->organization_id);
        })->get(['id', 'name', 'department_id']);
        
        return Inertia::render('Letters/Create', [
            'type' => $type,
            'categories' => $categories,
            'users' => $users,
            'departments' => $departments,
            'positions' => $positions,
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
     * ذخیره نامه جدید
     */
    public function store(Request $request)
    {
        $currentUser = auth()->user();
        
        // اعتبارسنجی
        $validator = Validator::make($request->all(), [
            'letter_type' => 'required|in:incoming,outgoing,internal',
            'category_id' => 'nullable|exists:letter_categories,id',
            'subject' => 'required|string|max:500',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'priority' => 'required|in:low,normal,high,urgent,very_urgent',
            'date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:date',
            'response_deadline' => 'nullable|date|after_or_equal:date',
            'sheet_count' => 'nullable|integer|min:1',
            'is_draft' => 'boolean',
            
            // اطلاعات فرستنده
            'sender_user_id' => 'nullable|exists:users,id',
            'sender_department_id' => 'nullable|exists:departments,id',
            'sender_name' => 'nullable|string|max:255',
            'sender_position_name' => 'nullable|string|max:255',
            
            // اطلاعات گیرنده
            'recipient_user_id' => 'nullable|exists:users,id',
            'recipient_department_id' => 'nullable|exists:departments,id',
            'recipient_name' => 'nullable|string|max:255',
            'recipient_position_name' => 'nullable|string|max:255',
            
            // رونوشت
            'cc_recipients' => 'nullable|array',
            'cc_recipients.*' => 'exists:positions,id',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        DB::beginTransaction();
        
        try {
            // تکمیل اطلاعات فرستنده
            $senderName = $request->sender_name;
            $senderPositionName = $request->sender_position_name;
            
            if ($request->sender_user_id) {
                $sender = User::find($request->sender_user_id);
                if ($sender) {
                    $senderName = $sender->full_name;
                    $senderPositionName = $sender->primaryPosition?->name;
                }
            }
            
            // تکمیل اطلاعات گیرنده
            $recipientName = $request->recipient_name;
            $recipientPositionName = $request->recipient_position_name;
            
            if ($request->recipient_user_id) {
                $recipient = User::find($request->recipient_user_id);
                if ($recipient) {
                    $recipientName = $recipient->full_name;
                    $recipientPositionName = $recipient->primaryPosition?->name;
                }
            }
            
            // ایجاد نامه
            $letter = Letter::create([
                'organization_id' => $currentUser->organization_id,
                'letter_type' => $request->letter_type,
                'letter_number' => $request->is_draft ? null : $this->generateLetterNumber($request->letter_type),
                'tracking_number' => $this->generateTrackingNumber(),
                'security_level' => $request->security_level,
                'priority' => $request->priority,
                'category_id' => $request->category_id,
                'subject' => $request->subject,
                'summary' => $request->summary,
                'content' => $request->content,
                'sender_user_id' => $request->sender_user_id,
                'sender_department_id' => $request->sender_department_id ?? $currentUser->department_id,
                'sender_name' => $senderName,
                'sender_position_name' => $senderPositionName,
                'recipient_user_id' => $request->recipient_user_id,
                'recipient_department_id' => $request->recipient_department_id,
                'recipient_name' => $recipientName,
                'recipient_position_name' => $recipientPositionName,
                'cc_recipients' => $request->cc_recipients,
                'date' => $request->date ?? now(),
                'due_date' => $request->due_date,
                'response_deadline' => $request->response_deadline,
                'sheet_count' => $request->sheet_count ?? 1,
                'is_draft' => $request->is_draft ?? false,
                'final_status' => $request->is_draft ? 'draft' : 'pending',
                'created_by' => $currentUser->id,
            ]);
            
            // اگر نامه منتشر شده است (پیش‌نویس نیست)، ارجاع ایجاد کن
            if (!$request->is_draft && $request->recipient_user_id) {
                $this->createRouting($letter, $request->recipient_user_id, $request->instruction);
            }
            
            // ثبت در تاریخچه
            LetterHistory::create([
                'letter_id' => $letter->id,
                'action_type' => 'created',
                'user_id' => $currentUser->id,
                'ip_address' => $request->ip(),
                'changes' => json_encode(['subject' => $letter->subject]),
            ]);
            
            DB::commit();
            
            $message = $request->is_draft ? 'پیش‌نویس نامه با موفقیت ذخیره شد.' : 'نامه با موفقیت ثبت شد.';
            
            return redirect()->route('letters.show', $letter->id)
                ->with('success', $message);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در ثبت نامه: ' . $e->getMessage())->withInput();
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
        
        return Inertia::render('Letters/Show', [
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
                'edit' => $currentUser->can(PermissionEnum::EDIT_LETTER->value) && $letter->is_draft,
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
        if (!$letter->is_draft || $letter->created_by !== $currentUser->id) {
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
        
        return Inertia::render('Letters/Edit', [
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
    
    private function generateTrackingNumber(): string
    {
        return 'TRK-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
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