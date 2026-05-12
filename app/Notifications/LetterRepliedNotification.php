<?php

namespace App\Notifications;

use App\Models\Letter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
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
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('پاسخ به مکتوب شما: ' . $this->originalLetter->subject)
            ->greeting('سلام ' . $notifiable->name . '،')
            ->line('به مکتوب شما با عنوان "' . $this->originalLetter->subject . '" پاسخ داده شده است.')
            ->line('پاسخ: ' . substr($this->replyLetter->content, 0, 200))
            ->action('مشاهده مکتوب', url('/letters/' . $this->originalLetter->id))
            ->line('تاریخ پاسخ: ' . $this->replyLetter->created_at->format('Y/m/d'))
            ->line('از توجه شما سپاسگزاریم.');
    }

    /**
     * Get the array representation of the notification (for database).
     *
     * @return array<string, mixed>
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
            'replier_avatar' => $this->replyLetter->creator->avatar ?? null,
            'replied_at' => $this->replyLetter->created_at->toISOString(),
            'priority' => $this->replyLetter->priority,
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
