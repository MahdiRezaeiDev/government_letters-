<?php

namespace App\Notifications;

use App\Models\Routing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LetterRoutedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Routing $routing) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('ارجاع نامه جدید: ' . $this->routing->letter->subject)
            ->greeting("با سلام {$notifiable->first_name} عزیز،")
            ->line("یک نامه جدید به شما ارجاع داده شده است.")
            ->line("موضوع: " . $this->routing->letter->subject)
            ->line("نوع اقدام: " . $this->routing->getActionTypeLabel())
            ->when($this->routing->instruction, fn($m) => $m->line("دستورالعمل: " . $this->routing->instruction))
            ->action('مشاهده نامه', url("/letters/{$this->routing->letter_id}"))
            ->salutation("با احترام");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'routing_id'   => $this->routing->id,
            'letter_id'    => $this->routing->letter_id,
            'subject'      => $this->routing->letter->subject,
            'action_type'  => $this->routing->action_type,
            'instruction'  => $this->routing->instruction,
            'from_user_id' => $this->routing->from_user_id,
            'deadline'     => $this->routing->deadline?->toISOString(),
        ];
    }
}
