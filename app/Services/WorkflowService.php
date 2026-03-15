<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\Routing;
use App\Models\Action;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class WorkflowService
{
    /**
     * ارجاع نامه به کاربر یا سمت
     */
    public function route(Letter $letter, array $data): Routing
    {
        $lastStep = $letter->routings()->max('step_order') ?? 0;

        $routing = Routing::create([
            'letter_id'       => $letter->id,
            'from_user_id'    => Auth::id(),
            'from_position_id'=> $data['from_position_id'] ?? null,
            'to_user_id'      => $data['to_user_id'] ?? null,
            'to_position_id'  => $data['to_position_id'] ?? null,
            'action_type'     => $data['action_type'] ?? 'action',
            'instruction'     => $data['instruction'] ?? null,
            'deadline'        => $data['deadline'] ?? null,
            'priority'        => $data['priority'] ?? 0,
            'step_order'      => $lastStep + 1,
            'is_parallel'     => $data['is_parallel'] ?? false,
            'status'          => 'pending',
        ]);

        // ثبت اقدام
        Action::create([
            'routing_id'  => $routing->id,
            'user_id'     => Auth::id(),
            'action_type' => 'forward',
            'description' => 'ارجاع نامه',
            'ip_address'  => request()->ip(),
        ]);

        // ارسال نوتیفیکیشن
        if ($routing->toUser) {
            $routing->toUser->notify(new \App\Notifications\LetterRoutedNotification($routing));
        }

        return $routing;
    }

    /**
     * تکمیل ارجاع
     */
    public function complete(Routing $routing, ?string $note = null): Routing
    {
        $routing->update([
            'status'         => 'completed',
            'completed_at'   => now(),
            'completed_note' => $note,
        ]);

        Action::create([
            'routing_id'  => $routing->id,
            'user_id'     => Auth::id(),
            'action_type' => 'complete',
            'description' => $note ?? 'اقدام انجام شد',
            'ip_address'  => request()->ip(),
        ]);

        return $routing;
    }

    /**
     * رد ارجاع
     */
    public function reject(Routing $routing, string $reason): Routing
    {
        $routing->update([
            'status'         => 'rejected',
            'completed_at'   => now(),
            'completed_note' => $reason,
        ]);

        Action::create([
            'routing_id'  => $routing->id,
            'user_id'     => Auth::id(),
            'action_type' => 'reject',
            'description' => $reason,
            'ip_address'  => request()->ip(),
        ]);

        return $routing;
    }

    /**
     * دریافت کارتابل کاربر
     */
    public function getCartable(User $user, array $filters = [])
    {
        $query = Routing::with(['letter.category', 'letter.createdBy', 'fromUser'])
            ->where('to_user_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress']);

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['action_type'])) {
            $query->where('action_type', $filters['action_type']);
        }

        if (!empty($filters['overdue'])) {
            $query->where('deadline', '<', now());
        }

        return $query->orderByDesc('created_at')->paginate(15);
    }

    /**
     * آمار کارتابل
     */
    public function getCartableStats(User $user): array
    {
        $base = Routing::where('to_user_id', $user->id);

        return [
            'total'     => (clone $base)->whereIn('status', ['pending', 'in_progress'])->count(),
            'pending'   => (clone $base)->where('status', 'pending')->count(),
            'overdue'   => (clone $base)->where('status', 'pending')->where('deadline', '<', now())->count(),
            'completed' => (clone $base)->where('status', 'completed')->whereDate('completed_at', today())->count(),
        ];
    }
}
