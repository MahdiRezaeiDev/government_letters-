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

class ProcessLetterAfterCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public Letter $letter;
    public User $creator;
    public array $tempFiles;
    public ?string $instruction;

    public function __construct(Letter $letter, User $creator, array $tempFiles = [], ?string $instruction = null)
    {
        $this->letter = $letter;
        $this->creator = $creator;
        $this->tempFiles = $tempFiles;
        $this->instruction = $instruction;
    }

    public function handle(LetterService $letterService)
    {
        // 1. انتقال فایل‌ها از مسیر موقت به مسیر نهایی
        if (!empty($this->tempFiles)) {
            foreach ($this->tempFiles as $tempFile) {
                $fileInfo = $letterService->moveTempFileToFinal($tempFile, $this->letter->id);
                
                if ($fileInfo) {
                    Attachment::create([
                        'letter_id' => $this->letter->id,
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

        // 2. ایجاد ارجاع اولیه
        if ($this->letter->recipient_user_id && $this->letter->final_status !== 'draft') {
            $letterService->createInitialRouting($this->letter, $this->letter->recipient_user_id, $this->instruction);
        }

        // 3. ارسال نوتیفیکیشن
        if ($this->letter->recipient_user_id && $this->letter->final_status !== 'draft') {
            event(new \App\Events\LetterSubmitted($this->letter));
        }
    }
}