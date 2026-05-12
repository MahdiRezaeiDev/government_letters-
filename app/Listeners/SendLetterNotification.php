<?php

namespace App\Listeners;

use App\Events\LetterSubmitted;
use App\Notifications\LetterReceivedNotification;

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

        if ($letter->recipientUser) {
            $letter->recipientUser->notify(
                new LetterReceivedNotification($letter)
            );
        }
    }
}
