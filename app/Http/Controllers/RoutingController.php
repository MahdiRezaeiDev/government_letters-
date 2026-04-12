<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use App\Models\Letter;
use App\Models\User;
use App\Models\Action;
use App\Models\Reminder;
use App\Models\LetterHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Enums\PermissionEnum;

class RoutingController extends Controller
{
    /**
     * کارتابل شخصی (لیست ارجاعات کاربر)
     */
    public function cartable(Request $request)
    {
        $currentUser = auth()->user();
        
        $query = Routing::query()
            ->with([
                'letter' => function ($q) {
                    $q->with(['senderDepartment', 'recipientDepartment', 'category']);
                },
                'fromUser',
                'toUser',
                'fromPosition',
                'toPosition',
            ])
            ->where(function ($q) use ($currentUser) {
                // ارجاعات به کاربر فعلی
                $q->where('to_user_id', $currentUser->id)
                  // یا ارجاعات به سمت کاربر فعلی (اگر کاربر چند سمت داشته باشد)
                  ->orWhereIn('to_position_id', $currentUser->positions()->pluck('id'));
            });
        
        // فیلتر وضعیت
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        } else {
            // پیش‌فرض: نمایش ارجاعات در انتظار
            $query->where('status', 'pending');
        }
        
        // فیلتر نوع اقدام
        if ($request->has('action_type') && $request->action_type) {
            $query->where('action_type', $request->action_type);
        }
        
        // فیلتر اولویت
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }
        
        // فیلتر تاخیر دار
        if ($request->has('overdue') && $request->overdue) {
            $query->where('deadline', '<', now())
                  ->where('status', 'pending');
        }
        
        $routings = $query->orderBy('deadline', 'asc')
            ->orderBy('priority', 'desc')
            ->paginate(15);
        
        // آمار کارتابل
        $stats = [
            'total' => Routing::where('to_user_id', $currentUser->id)
                ->where('status', 'pending')
                ->count(),
            'overdue' => Routing::where('to_user_id', $currentUser->id)
                ->where('status', 'pending')
                ->where('deadline', '<', now())
                ->count(),
            'today' => Routing::where('to_user_id', $currentUser->id)
                ->whereDate('deadline', now())
                ->where('status', 'pending')
                ->count(),
            'completed_today' => Routing::where('to_user_id', $currentUser->id)
                ->whereDate('completed_at', now())
                ->where('status', 'completed')
                ->count(),
        ];
        
        return Inertia::render('Cartable/Index', [
            'routings' => $routings,
            'stats' => $stats,
            'filters' => $request->only(['status', 'action_type', 'priority', 'overdue']),
            'actionTypes' => [
                'action' => 'اقدام',
                'information' => 'اطلاع',
                'approval' => 'تأیید',
                'coordination' => 'هماهنگی',
                'sign' => 'امضاء',
            ],
        ]);
    }

    /**
     * نمایش فرم ارجاع نامه
     */
    public function create(Letter $letter)
    {
        $currentUser = auth()->user();
        
        // بررسی دسترسی برای ارجاع
        if (!$currentUser->can(PermissionEnum::ROUTE_LETTER->value)) {
            abort(403);
        }
        
        // لیست کاربران قابل ارجاع (همان سازمان)
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
        
        return Inertia::render('Routings/Create', [
            'letter' => $letter->only(['id', 'subject', 'letter_number']),
            'users' => $users,
            'actionTypes' => [
                'action' => 'اقدام',
                'information' => 'اطلاع',
                'approval' => 'تأیید',
                'coordination' => 'هماهنگی',
                'sign' => 'امضاء',
            ],
        ]);
    }

    /**
     * ذخیره ارجاع جدید
     */
    public function store(Request $request, Letter $letter)
    {
        $currentUser = auth()->user();
        
        $validator = Validator::make($request->all(), [
            'to_user_id' => 'required|exists:users,id',
            'action_type' => 'required|in:action,information,approval,coordination,sign',
            'instruction' => 'nullable|string',
            'deadline' => 'nullable|date|after:now',
            'priority' => 'nullable|integer|min:0|max:5',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        DB::beginTransaction();
        
        try {
            // پیدا کردن آخرین step_order
            $lastStep = Routing::where('letter_id', $letter->id)->max('step_order') ?? 0;
            
            $routing = Routing::create([
                'letter_id' => $letter->id,
                'from_user_id' => $currentUser->id,
                'from_position_id' => $currentUser->primary_position_id,
                'to_user_id' => $request->to_user_id,
                'to_position_id' => User::find($request->to_user_id)?->primary_position_id,
                'action_type' => $request->action_type,
                'instruction' => $request->instruction,
                'deadline' => $request->deadline,
                'priority' => $request->priority ?? 0,
                'step_order' => $lastStep + 1,
                'status' => 'pending',
            ]);
            
            // ثبت اقدام
            Action::create([
                'routing_id' => $routing->id,
                'user_id' => $currentUser->id,
                'action_type' => 'forward',
                'description' => "نامه به {$routing->toUser->full_name} ارجاع شد",
                'ip_address' => $request->ip(),
            ]);
            
            // ثبت در تاریخچه
            LetterHistory::create([
                'letter_id' => $letter->id,
                'action_type' => 'routed',
                'user_id' => $currentUser->id,
                'ip_address' => $request->ip(),
                'changes' => json_encode([
                    'to_user' => $routing->toUser->full_name,
                    'action_type' => $routing->action_type,
                ]),
            ]);
            
            // ایجاد یادآوری (اگر ددلاین وجود داشته باشد)
            if ($request->deadline) {
                Reminder::create([
                    'letter_id' => $letter->id,
                    'routing_id' => $routing->id,
                    'user_id' => $request->to_user_id,
                    'reminder_type' => 'deadline',
                    'reminder_date' => $request->deadline,
                    'status' => 'pending',
                    'created_by' => $currentUser->id,
                ]);
            }
            
            DB::commit();
            
            return redirect()->route('letters.show', $letter->id)
                ->with('success', 'نامه با موفقیت ارجاع شد.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در ارجاع نامه: ' . $e->getMessage());
        }
    }

    /**
     * تکمیل اقدام (انجام کار)
     */
    public function complete(Request $request, Routing $routing)
    {
        $currentUser = auth()->user();
        
        // بررسی اینکه کاربر مجاز به تکمیل این اقدام است
        if ($routing->to_user_id !== $currentUser->id && 
            !in_array($routing->to_position_id, $currentUser->positions()->pluck('id')->toArray())) {
            abort(403);
        }
        
        // بررسی اینکه اقدام قبلاً تکمیل نشده باشد
        if ($routing->status !== 'pending') {
            return back()->with('error', 'این اقدام قبلاً تکمیل شده است.');
        }
        
        $validator = Validator::make($request->all(), [
            'note' => 'nullable|string|max:500',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        DB::beginTransaction();
        
        try {
            $routing->update([
                'status' => 'completed',
                'completed_at' => now(),
                'completed_note' => $request->note,
            ]);
            
            // ثبت اقدام
            Action::create([
                'routing_id' => $routing->id,
                'user_id' => $currentUser->id,
                'action_type' => 'complete',
                'description' => $request->note ?? 'اقدام انجام شد',
                'ip_address' => $request->ip(),
            ]);
            
            // بروزرسانی وضعیت نامه اگر آخرین مرحله باشد
            $pendingRoutings = Routing::where('letter_id', $routing->letter_id)
                ->where('status', 'pending')
                ->count();
            
            if ($pendingRoutings === 0 && $routing->letter->final_status === 'pending') {
                $routing->letter->update(['final_status' => 'approved']);
            }
            
            // ثبت در تاریخچه
            LetterHistory::create([
                'letter_id' => $routing->letter_id,
                'action_type' => 'completed',
                'user_id' => $currentUser->id,
                'ip_address' => $request->ip(),
                'changes' => json_encode([
                    'action_type' => $routing->action_type,
                    'note' => $request->note,
                ]),
            ]);
            
            DB::commit();
            
            return redirect()->back()->with('success', 'اقدام با موفقیت تکمیل شد.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در تکمیل اقدام: ' . $e->getMessage());
        }
    }

    /**
     * رد کردن اقدام
     */
    public function reject(Request $request, Routing $routing)
    {
        $currentUser = auth()->user();
        
        if ($routing->to_user_id !== $currentUser->id) {
            abort(403);
        }
        
        if ($routing->status !== 'pending') {
            return back()->with('error', 'این اقدام قبلاً تکمیل یا رد شده است.');
        }
        
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        DB::beginTransaction();
        
        try {
            $routing->update([
                'status' => 'rejected',
                'completed_at' => now(),
                'completed_note' => $request->reason,
            ]);
            
            // ثبت اقدام
            Action::create([
                'routing_id' => $routing->id,
                'user_id' => $currentUser->id,
                'action_type' => 'reject',
                'description' => $request->reason,
                'ip_address' => $request->ip(),
            ]);
            
            // بروزرسانی وضعیت نامه
            $routing->letter->update(['final_status' => 'rejected']);
            
            // ثبت در تاریخچه
            LetterHistory::create([
                'letter_id' => $routing->letter_id,
                'action_type' => 'rejected',
                'user_id' => $currentUser->id,
                'ip_address' => $request->ip(),
                'changes' => json_encode(['reason' => $request->reason]),
            ]);
            
            DB::commit();
            
            return redirect()->back()->with('success', 'اقدام با موفقیت رد شد.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا در رد اقدام: ' . $e->getMessage());
        }
    }

    /**
     * نمایش تاریخچه ارجاعات یک نامه
     */
    public function history(Letter $letter)
    {
        $currentUser = auth()->user();
        
        // بررسی دسترسی به نامه
        if (!$currentUser->isSuperAdmin() && 
            !$currentUser->isOrgAdmin() && 
            $currentUser->id !== $letter->created_by) {
            abort(403);
        }
        
        $routings = Routing::where('letter_id', $letter->id)
            ->with(['fromUser', 'toUser', 'actions.user'])
            ->orderBy('step_order')
            ->get();
        
        return Inertia::render('Routings/History', [
            'letter' => $letter->only(['id', 'subject', 'letter_number']),
            'routings' => $routings,
        ]);
    }

    /**
     * ارسال یادآوری برای ارجاعات ددلاین گذشته
     */
    public function sendReminders()
    {
        $overdueRoutings = Routing::where('status', 'pending')
            ->where('deadline', '<', now())
            ->whereDoesntHave('reminders', function ($q) {
                $q->whereDate('reminder_date', today());
            })
            ->get();
        
        $count = 0;
        foreach ($overdueRoutings as $routing) {
            // ایجاد یادآوری جدید
            Reminder::create([
                'letter_id' => $routing->letter_id,
                'routing_id' => $routing->id,
                'user_id' => $routing->to_user_id,
                'reminder_type' => 'deadline',
                'reminder_date' => now(),
                'message' => "مهلت انجام اقدام برای نامه {$routing->letter->subject} به پایان رسیده است.",
                'status' => 'pending',
                'created_by' => 1,
            ]);
            
            $count++;
        }
        
        return response()->json([
            'message' => "{$count} یادآوری ارسال شد.",
        ]);
    }
}