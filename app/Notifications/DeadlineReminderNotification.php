<?php

namespace App\Notifications;

use App\Models\Letter;
use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class DeadlineReminderNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public function __construct(
        public Reminder $reminder,
        public Letter $letter
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'letter_id' => $this->letter->id,
            'reminder_id' => $this->reminder->id,
            'title' => 'یادآوری مهلت',
            'message' => $this->reminder->message
                ?: "مهلت اقدام برای مکتوب «{$this->letter->subject}» گذشته است.",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'letter_id' => $this->letter->id,
            'title' => 'یادآوری مهلت',
            'message' => $this->reminder->message
                ?: "مهلت اقدام برای مکتوب «{$this->letter->subject}» گذشته است.",
            'type' => 'deadline_reminder',
        ]);
    }
}
