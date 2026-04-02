<?php
namespace App\Notifications;

use App\Models\Routing;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LetterRoutedNotification extends Notification
{
    use Queueable;

    public function __construct(public Routing $routing) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $letter = $this->routing->letter;
        $from   = $this->routing->fromUser;

        return [
            'routing_id'   => $this->routing->id,
            'letter_id'    => $letter->id,
            'subject'      => $letter->subject,
            'action_type'  => $this->routing->action_type,
            'instruction'  => $this->routing->instruction,
            'from_name'    => $from
                                ? "{$from->first_name} {$from->last_name}"
                                : '---',
            'deadline'     => $this->routing->deadline,
        ];
    }
}