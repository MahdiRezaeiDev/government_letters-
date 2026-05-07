<?php

namespace App\Listeners;

use App\Events\LetterSubmited;
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
    public function handle(LetterSubmited $event): void
    {
        //
    }
}
