<?php

namespace App\Notifications;

use App\Models\Letter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class LetterRepliedNotification extends Notification implements ShouldQueue, ShouldBroadcast
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
     * Clean UTF-8 strings to ensure they can be JSON encoded
     */
    private function cleanString($string, $default = ''): string
    {
        if (empty($string)) {
            return $default;
        }

        // Convert to string
        $string = (string) $string;

        // Remove invalid UTF-8 characters
        $string = mb_convert_encoding($string, 'UTF-8', 'UTF-8');

        // Remove control characters
        $string = preg_replace('/[\x00-\x1F\x7F-\x9F]/u', '', $string);

        // Limit length
        $string = mb_substr($string, 0, 200, 'UTF-8');

        return $string ?: $default;
    }

    private function repliedBy(Letter $letter): string
    {
        $user = $letter->senderUser;

        return $user->first_name . ' ' . $user->last_name;
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
            'original_letter_subject' => $this->cleanString($this->originalLetter->subject, 'بدون موضوع'),
            'reply_content' => $this->cleanString(substr($this->replyLetter->content, 0, 100), 'بدون متن'),
            'replier_name' => $this->repliedBy($this->replyLetter),
            'replier_id' => $this->replyLetter->senderUser->id,
            'replied_at' => $this->replyLetter->created_at?->toISOString() ?? now()->toISOString(),
            'priority' => $this->replyLetter->priority ?? 'normal',
            'reference_number' => $this->cleanString($this->originalLetter->reference_number, ''),
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $replierName = $this->repliedBy($this->replyLetter);
        $subject = $this->cleanString($this->originalLetter->subject, 'مکتوب');
        $content = $this->cleanString(substr($this->replyLetter->content, 0, 100), 'پاسخ جدید');

        return new BroadcastMessage([
            'id' => (string) $this->id,
            'type' => 'letter_replied',
            'data' => [
                'reply_letter_id' => $this->replyLetter->id,
                'original_letter_id' => $this->originalLetter->id,
                'original_letter_subject' => $subject,
                'reply_content' => $content,
                'replier_name' => $replierName,
                'replied_at' => $this->replyLetter->created_at?->diffForHumans() ?? 'اخیرا',
            ],
            'message' => $replierName . ' به مکتوب شما پاسخ داد',
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
