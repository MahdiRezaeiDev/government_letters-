<?php

namespace App\Notifications;

use App\Models\Letter;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LetterReceivedNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public function __construct(public Letter $letter) {}

    // ۱. ذخیره در database ✅
    public function via(): array
    {
        return ['database', 'broadcast'];
    }

    // ۲. داده‌ای که در DB ذخیره میشه
    public function toDatabase(): array
    {
        return [
            'letter_id' => $this->letter->id,
            'title'     => $this->letter->subject,
            'message'   => 'یک نامه جدید دریافت کردید',
        ];
    }

    // ۳. داده‌ای که live میره به frontend
    public function toBroadcast(): BroadcastMessage
    {
        return new BroadcastMessage([
            'letter_id' => $this->letter->id,
            'title'     => $this->letter->subject,
            'message'   => 'یک نامه جدید دریافت کردید',
        ]);
    }

    // channel اختصاصی هر user
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' .$this->letter->recipient_user_id),
        ];
    }
}
