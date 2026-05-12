<?php

namespace App\Listeners;

use App\Events\LetterReplied;
use App\Notifications\LetterRepliedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendLetterRepliedNotification implements ShouldQueue
{
    public function handle(LetterReplied $event): void
    {
        // Notify the creator of the original letter
        $originalLetterCreator = $event->originalLetter->senderUser;

        if ($originalLetterCreator) {
            $originalLetterCreator->notify(
                new LetterRepliedNotification($event->replayLetter, $event->originalLetter)
            );
        }
    }
}
