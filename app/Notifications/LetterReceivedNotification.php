<?php

namespace App\Notifications;

use App\Models\Letter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

// ✅ فقط ShouldBroadcast - بدون ShouldQueue
class LetterReceivedNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public function __construct(public Letter $letter, public bool $isReception = false) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'letter_id' => $this->letter->id,
            'title'     => $this->letter->subject,
            'message'   => $this->isReception
                ? 'نامه جدید در دبیرخانه دریافت شد'
                : 'یک مکتوب جدید دریافت کردید',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'letter_id' => $this->letter->id,
            'title'     => $this->letter->subject,
            'message'   => $this->isReception
                ? 'نامه جدید در دبیرخانه دریافت شد'
                : 'یک مکتوب جدید دریافت کردید',
        ]);
    }
}
