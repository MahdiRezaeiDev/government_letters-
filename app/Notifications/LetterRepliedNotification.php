<?php

namespace App\Notifications;

use App\Models\Letter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class LetterRepliedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Letter $replyLetter,
        public Letter $originalLetter
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'letter_replied',
            'reply_letter_id' => $this->replyLetter->id,
            'original_letter_id' => $this->originalLetter->id,
            'original_letter_subject' => $this->originalLetter->subject,
            'reply_content' => substr($this->replyLetter->content, 0, 100),
            'replier_name' => $this->replyLetter->creator->name,
            'replier_id' => $this->replyLetter->creator->id,
            'replied_at' => $this->replyLetter->created_at->toISOString(),
            'priority' => $this->replyLetter->priority,
            'reference_number' => $this->originalLetter->reference_number,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'letter_replied',
            'data' => [
                'reply_letter_id' => $this->replyLetter->id,
                'original_letter_id' => $this->originalLetter->id,
                'original_letter_subject' => $this->originalLetter->subject,
                'reply_content' => substr($this->replyLetter->content, 0, 100),
                'replier_name' => $this->replyLetter->creator->name,
                'replied_at' => $this->replyLetter->created_at->diffForHumans(),
            ],
            'message' => $this->replyLetter->creator->name . ' به مکتوب شما پاسخ داد',
            'icon' => 'mail-reply',
            'link' => '/letters/' . $this->originalLetter->id,
        ]);
    }

    /**
     * Get the notification's database type.
     */
    public function databaseType(object $notifiable): string
    {
        return 'letter_replied';
    }
}
