<?php

namespace App\Listeners;

use App\Events\LetterSubmitted;
use App\Models\User;
use App\Notifications\LetterReceivedNotification;
use App\Services\LetterService;

class SendLetterNotification
{
    /**
     * Create the event listener.
     */
    public function __construct(protected LetterService $letterService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LetterSubmitted $event): void
    {
        $letter = $event->letter;
        $target = $this->letterService->resolveInitialRoutingTarget($letter);

        if (!$target || empty($target['user_id'])) {
            return;
        }

        $notifyUser = User::find($target['user_id']);

        if ($notifyUser) {
            $notifyUser->notify(
                new LetterReceivedNotification($letter, $target['is_reception'] ?? false)
            );
        }
    }
}
