<?php
// app/Services/NotificationService.php

namespace App\Services;

use App\Models\Letter;
use App\Models\Routing;
use App\Models\User;
use App\Notifications\RoutingReceived;
use App\Notifications\RoutingOverdue;
use App\Notifications\RoutingCompleted;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    /**
     * ارسال نوتیفیکیشن دریافت ارجاع
     */
    public function notifyRoutingReceived(Routing $routing): void
    {
        if ($routing->toUser) {
            $routing->toUser->notify(new RoutingReceived($routing));
        }

        // اگر به سمت ارجاع شده، به همه دارندگان آن سمت
        if ($routing->toPosition && !$routing->toUser) {
            $users = $routing->toPosition->activeUsers;
            Notification::send($users, new RoutingReceived($routing));
        }
    }

    /**
     * یادآوری برای ارجاعات نزدیک به موعد
     */
    public function sendRoutingReminders(): int
    {
        $reminderDays = config('correspondence.workflow.reminder_before_days', 2);

        $overdueRoutings = Routing::with('toUser', 'letter')
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('reminder_sent', false)
            ->where('deadline', '<=', now()->addDays($reminderDays))
            ->get();

        foreach ($overdueRoutings as $routing) {
            if ($routing->toUser) {
                $routing->toUser->notify(new RoutingOverdue($routing));
                $routing->update(['reminder_sent' => true, 'reminder_sent_at' => now()]);
            }
        }

        return $overdueRoutings->count();
    }

    /**
     * نوتیفیکیشن تکمیل ارجاع موازی
     */
    public function notifyParallelComplete(Letter $letter): void
    {
        // نوتیف به ارجاع‌دهنده اصلی
        if ($letter->creator) {
            // $letter->creator->notify(new ParallelRoutingCompleted($letter));
        }
    }
}