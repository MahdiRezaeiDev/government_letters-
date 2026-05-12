<?php

namespace App\Listeners;

use App\Events\LetterReplied;
use App\Notifications\LetterRepliedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Laravel\Reverb\Loggers\Log;

class SendLetterRepliedNotification implements ShouldQueue
{
    public function handle(LetterReplied $event): void
    {
        // Notify the creator of the original letter
        $originalLetterCreator = $event->originalLetter->senderUser;

        Log::info("". $originalLetterCreator->name ."");

        if ($originalLetterCreator) {
            $originalLetterCreator->notify(
                new LetterRepliedNotification($event->replayLetter, $event->originalLetter)
            );
        }
    }
}
