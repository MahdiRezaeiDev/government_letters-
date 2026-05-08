<?php

namespace App\Listeners;

use App\Events\LetterSubmitted;
use App\Notifications\LetterReceivedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendLetterNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LetterSubmitted $event): void
    {
        $letter = $event->letter;

        // گیرنده داخلی داره؟
        if ($letter->recipientUser) {
            $letter->recipientUser->notify(
                new LetterReceivedNotification($letter)
            );
        }
    }
}
