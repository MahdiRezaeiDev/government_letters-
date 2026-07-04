<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use App\Models\LetterDelegation;
use App\Models\LetterHistory;
use App\Notifications\LetterReceivedNotification;
use App\Services\LetterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartableController extends Controller
{
    public function __construct(protected LetterService $letterService) {}
    /**
     * نمایش کارتابل شخصی کاربر
     */
    // app/Http/Controllers/CartableController.php

    public function index(Request $request)
    {
        $user = auth()->user();

        // 1. روتینگ‌های در انتظار اقدام
        $routings = Routing::where(function ($q) use ($user) {
            $q->where('to_user_id', $user->id)
                ->orWhere(function ($sub) use ($user) {
                    $sub->whereNull('to_user_id')
                        ->where('to_position_id', $user->position_id);
                });
        })
            ->where('status', 'pending')
            ->with(['letter.recipientUser', 'letter.recipientDepartment', 'fromUser', 'toUser'])
            ->orderBy('created_at', 'asc')
            ->paginate(15);

        // 2. ارجاع‌های در انتظار تصمیم (pending)
        $pendingDelegations = LetterDelegation::where('delegated_to_user_id', $user->id)
            ->where('status', 'pending')
            ->with(['letter', 'delegatedBy'])
            ->get();

        // 3. ارجاع‌های پذیرفته شده - در انتظار پاسخ (accepted)
        $acceptedDelegations = LetterDelegation::where('delegated_to_user_id', $user->id)
            ->where('status', 'accepted')
            ->with(['letter', 'delegatedBy'])
            ->get();

        // 4. آمارها
        $stats = [
            'total' => $routings->total() + $pendingDelegations->count(),
            'overdue' => $routings->where('deadline', '<', now())->count(),
            'today' => $routings->where('deadline', today())->count(),
            'completed_today' => 0,
            'pending_delegations' => $pendingDelegations->count(),
            'accepted_delegations' => $acceptedDelegations->count(),
        ];

        return Inertia::render('cartable/index', [
            'routings' => $routings,
            'pendingDelegations' => $pendingDelegations,
            'acceptedDelegations' => $acceptedDelegations,
            'stats' => $stats,
            'actionTypes' => $this->getActionTypes(),
            'priorities' => $this->getPriorities(),
            'filters' => $request->only(['status', 'action_type', 'priority', 'overdue']),
        ]);
    }

    /**
     * دریافت انواع اقدامات از دیتابیس
     */
    private function getActionTypes(): array
    {
        return [
            'action' => 'اقدام',
            'information' => 'اطلاع رسانی',
            'approval' => 'تأیید',
            'coordination' => 'هماهنگی',
            'sign' => 'امضا',
        ];
    }

    /**
     * دریافت اولویت‌ها از دیتابیس
     */
    private function getPriorities(): array
    {
        return [
            'low' => 'کم',
            'normal' => 'عادی',
            'high' => 'مهم',
            'urgent' => 'فوری',
            'very_urgent' => 'خیلی فوری',
        ];
    }


    /**
     * تکمیل اقدام
     */
    public function complete(Request $request, Routing $routing)
    {
        $user = auth()->user();

        // بررسی دسترسی
        if (
            $routing->to_user_id !== $user->id &&
            !in_array($routing->to_position_id, $user->positions()->pluck('id')->toArray())
        ) {
            return response()->json(['message' => 'شما دسترسی به این اقدام ندارید.'], 403);
        }

        // بررسی وضعیت
        if ($routing->status !== 'pending') {
            return response()->json(['message' => 'این اقدام قبلاً تکمیل شده است.'], 400);
        }

        $request->validate([
            'note' => 'nullable|string|max:500',
        ]);

        // تکمیل اقدام
        $routing->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completed_note' => $request->note,
        ]);

        // ثبت در تاریخچه
        \App\Models\Action::create([
            'routing_id' => $routing->id,
            'user_id' => $user->id,
            'action_type' => 'complete',
            'description' => $request->note ?? 'اقدام انجام شد',
            'ip_address' => $request->ip(),
        ]);

        // بروزرسانی وضعیت نامه اگر همه اقدامات تکمیل شده باشند
        $pendingCount = Routing::where('letter_id', $routing->letter_id)
            ->where('status', 'pending')
            ->count();

        if ($pendingCount === 0 && $routing->letter->final_status === 'pending') {
            $routing->letter->update(['final_status' => 'approved']);
        }

        return redirect()->back()->with('success', 'اقدام با موفقیت تکمیل شد.');
    }

    /**
     * رد اقدام
     */
    public function reject(Request $request, Routing $routing)
    {
        $user = auth()->user();

        // بررسی دسترسی
        if ($routing->to_user_id !== $user->id) {
            return response()->json(['message' => 'شما دسترسی به این اقدام ندارید.'], 403);
        }

        // بررسی وضعیت
        if ($routing->status !== 'pending') {
            return response()->json(['message' => 'این اقدام قبلاً تکمیل یا رد شده است.'], 400);
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // رد اقدام
        $routing->update([
            'status' => 'rejected',
            'completed_at' => now(),
            'completed_note' => $request->reason,
        ]);

        // ثبت در تاریخچه
        \App\Models\Action::create([
            'routing_id' => $routing->id,
            'user_id' => $user->id,
            'action_type' => 'reject',
            'description' => $request->reason,
            'ip_address' => $request->ip(),
        ]);

        // بروزرسانی وضعیت نامه
        $routing->letter->update(['final_status' => 'rejected']);

        return redirect()->back()->with('success', 'اقدام با موفقیت رد شد.');
    }

    /**
     * ارجاع نامه از دبیرخانه به گیرنده مقصد
     */
    public function forward(Request $request, Routing $routing)
    {
        $user = auth()->user();

        if (!$routing->is_reception || $routing->to_user_id !== $user->id) {
            abort(403, 'شما مجاز به ارجاع این نامه از دبیرخانه نیستید.');
        }

        if ($routing->status !== 'pending') {
            return back()->with('error', 'این اقدام قبلاً تکمیل شده است.');
        }

        $letter = $routing->letter;

        if (!$letter?->recipient_user_id) {
            return back()->with('error', 'گیرنده مقصد برای این نامه مشخص نیست.');
        }

        $request->validate([
            'note' => 'nullable|string|max:500',
            'to_user_id' => 'required|exists:users,id',
            'to_position_id' => 'nullable|exists:positions,id',
            'to_department_id' => 'nullable|exists:departments,id',
        ]);

        DB::beginTransaction();

        try {
            $forwardRouting = $this->letterService->forwardFromReception(
                $routing,
                $user,
                (int) $request->to_user_id,
                $request->to_position_id ? (int) $request->to_position_id : null,
                $request->to_department_id ? (int) $request->to_department_id : null,
                $request->note
            );

            if (!$forwardRouting) {
                DB::rollBack();

                return back()->with('error', 'خطا در ارجاع نامه به گیرنده مقصد.');
            }

            \App\Models\Action::create([
                'routing_id' => $routing->id,
                'user_id' => $user->id,
                'action_type' => 'forward',
                'description' => $request->note ?? 'ارجاع از دبیرخانه به گیرنده مقصد',
                'ip_address' => $request->ip(),
            ]);

            LetterHistory::create([
                'letter_id' => $letter->id,
                'action_type' => 'routed',
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'changes' => json_encode([
                    'from' => 'reception',
                    'to_user' => $letter->recipientUser?->full_name,
                ]),
            ]);

            $letter->recipientUser?->notify(
                new LetterReceivedNotification($letter->fresh(), false)
            );

            DB::commit();

            return redirect()->back()->with('success', 'نامه با موفقیت به گیرنده مقصد ارجاع شد.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'خطا در ارجاع نامه: ' . $e->getMessage());
        }
    }
}
