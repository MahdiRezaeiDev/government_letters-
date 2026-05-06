<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use App\Models\LetterDelegation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartableController extends Controller
{
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
            ->with(['letter', 'fromUser', 'toUser'])
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
}
