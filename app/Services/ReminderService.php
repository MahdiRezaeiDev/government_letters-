<?php

namespace App\Services;

use App\Models\Reminder;
use App\Models\Routing;
use App\Models\User;
use App\Notifications\DeadlineReminderNotification;
use Illuminate\Support\Facades\Log;

class ReminderService
{
    /**
     * Create overdue reminders and notify assigned users.
     */
    public function processDeadlineReminders(): int
    {
        $overdueRoutings = Routing::query()
            ->with('letter')
            ->where('status', 'pending')
            ->whereNotNull('deadline')
            ->where('deadline', '<', now())
            ->whereNotNull('to_user_id')
            ->whereDoesntHave('reminders', function ($q) {
                $q->whereDate('reminder_date', today())
                    ->where('reminder_type', 'deadline');
            })
            ->get();

        $count = 0;

        foreach ($overdueRoutings as $routing) {
            $letter = $routing->letter;
            if (! $letter || ! $routing->to_user_id) {
                continue;
            }

            $message = "مهلت انجام اقدام برای مکتوب «{$letter->subject}» به پایان رسیده است.";

            $reminder = Reminder::create([
                'letter_id' => $routing->letter_id,
                'routing_id' => $routing->id,
                'user_id' => $routing->to_user_id,
                'reminder_type' => 'deadline',
                'reminder_date' => now(),
                'message' => $message,
                'status' => 'pending',
                'is_sent' => false,
                'created_by' => $routing->from_user_id,
            ]);

            $user = User::find($routing->to_user_id);
            if ($user) {
                try {
                    $user->notify(new DeadlineReminderNotification($reminder, $letter));
                    $reminder->markAsSent();
                    $count++;
                } catch (\Throwable $e) {
                    Log::warning('Failed to send deadline reminder', [
                        'reminder_id' => $reminder->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        // Also dispatch any pending reminders that are due
        $pending = Reminder::query()
            ->with(['letter', 'user'])
            ->pending()
            ->where('is_sent', false)
            ->where('reminder_type', '!=', 'deadline')
            ->limit(100)
            ->get();

        foreach ($pending as $reminder) {
            if (! $reminder->user || ! $reminder->letter) {
                continue;
            }

            try {
                $reminder->user->notify(
                    new DeadlineReminderNotification($reminder, $reminder->letter)
                );
                $reminder->markAsSent();
                $count++;
            } catch (\Throwable $e) {
                Log::warning('Failed to send pending reminder', [
                    'reminder_id' => $reminder->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $count;
    }
}
