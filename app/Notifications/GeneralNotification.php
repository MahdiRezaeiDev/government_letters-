<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;

class GeneralNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public function __construct(
        public string $title,
        public string $message,
        public string $type = 'info' // info | success | warning | error
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast']; // هم دیتابیس هم ریل‌تایم
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title'   => $this->title,
            'message' => $this->message,
            'type'    => $this->type,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title'   => $this->title,
            'message' => $this->message,
            'type'    => $this->type,
        ]);
    }
}
