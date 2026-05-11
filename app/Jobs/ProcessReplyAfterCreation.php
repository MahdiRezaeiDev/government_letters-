<?php

namespace App\Jobs;

use App\Models\Letter;
use App\Models\User;
use App\Models\Attachment;
use App\Services\LetterService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessReplyAfterCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public Letter $replyLetter;
    public Letter $originalLetter;
    public User $creator;
    public array $tempFiles;
    public ?string $instruction;
    public array $recipientData;

    public function __construct(
        Letter $replyLetter,
        Letter $originalLetter,
        User $creator,
        array $tempFiles = [],
        ?string $instruction = null,
        array $recipientData = []
    ) {
        $this->replyLetter = $replyLetter;
        $this->originalLetter = $originalLetter;
        $this->creator = $creator;
        $this->tempFiles = $tempFiles;
        $this->instruction = $instruction;
        $this->recipientData = $recipientData;
    }

    public function handle(LetterService $letterService)
    {
        // 1. انتقال فایل‌ها
        if (!empty($this->tempFiles)) {
            foreach ($this->tempFiles as $tempFile) {
                $fileInfo = $letterService->moveTempFileToFinal($tempFile, $this->replyLetter->id);

                if ($fileInfo) {
                    Attachment::create([
                        'letter_id' => $this->replyLetter->id,
                        'user_id' => $this->creator->id,
                        'file_name' => $fileInfo['file_name'],
                        'file_path' => $fileInfo['file_path'],
                        'file_size' => $fileInfo['file_size'],
                        'mime_type' => $fileInfo['mime_type'],
                        'extension' => $fileInfo['extension'],
                    ]);
                }
            }
        }

        // 2. به‌روزرسانی وضعیت نامه اصلی
        if ($this->replyLetter->final_status !== 'draft') {
            $this->originalLetter->update([
                'replied_at' => now(),
                'replied_by' => $this->creator->id,
            ]);
        }

        // 3. ایجاد ارجاع در صورت نیاز
        if ($letterService->shouldCreateRoutingForReply($this->recipientData, $this->replyLetter)) {
            $letterService->createInitialRouting(
                $this->replyLetter,
                $this->recipientData['user_id'] ?? null,
                $this->instruction
            );
        }

        // 4. ارسال نوتیفیکیشن
        // if ($this->replyLetter->recipient_user_id && $this->replyLetter->final_status !== 'draft') {
        //     event(new \App\Events\LetterReplied($this->replyLetter, $this->originalLetter));
        // }
    }
}
