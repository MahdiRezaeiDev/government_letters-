<?php

namespace App\Services;

use App\Jobs\ProcessLetterAfterCreation;
use App\Jobs\ProcessReplyAfterCreation;
use App\Models\Letter;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LetterService
{
    /**
     * ایجاد یک نامه جدید
     */
    public function createLetter(array $data, User $creator): Letter
    {
        DB::beginTransaction();

        try {
            $tempFiles = $this->storeTempFiles($data['attachments'] ?? []);

            $senderData = $this->prepareSenderData($creator);
            $recipientData = $this->prepareRecipientData($data);
            $trackingNumber = $this->generateTrackingNumber();
            $letterNumber = $this->generateLetterNumber($data);

            $letter = $this->storeLetter(
                $data,
                $creator,
                $senderData,
                $recipientData,
                $trackingNumber,
                $letterNumber
            );

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Letter creation failed', $e);
            throw $e;
        }

        ProcessLetterAfterCreation::dispatch(
            $letter,
            $creator,
            $tempFiles,
            $data['instruction'] ?? null
        );

        return $letter;
    }

    /**
     * ایجاد پاسخ به یک نامه
     */
    public function createReply(array $data, Letter $originalLetter, User $creator): Letter
    {
        DB::beginTransaction();

        try {
            // ذخیره موقت فایل‌ها
            $tempFiles = $this->storeTempFiles($data['attachments'] ?? []);

            $senderData = $this->prepareSenderData($creator);
            $recipientData = $this->prepareRecipientData($data);
            $trackingNumber = $this->generateTrackingNumber();
            $letterNumber = $this->generateLetterNumber($data);
            $threadId = $originalLetter->thread_id ?? $originalLetter->uuid ?? \Illuminate\Support\Str::uuid();

            $replyLetter = $this->storeReply(
                $data,
                $originalLetter,
                $creator,
                $senderData,
                $recipientData,
                $trackingNumber,
                $letterNumber,
                $threadId
            );

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Reply creation failed', $e);
            throw $e;
        }

        ProcessReplyAfterCreation::dispatch(
            $replyLetter,
            $originalLetter,
            $creator,
            $tempFiles,
            $data['instruction'] ?? null,
            $recipientData
        );

        return $replyLetter;
    }

    /**
     * ذخیره موقت فایل‌ها و بازگرداندن اطلاعات آنها
     */
    protected function storeTempFiles(array $files): array
    {
        $tempFiles = [];

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile || !$file->isValid()) {
                continue;
            }

            $tempPath = $file->store('temp/attachments', 'public');

            $tempFiles[] = [
                'original_name' => $file->getClientOriginalName(),
                'temp_path' => $tempPath,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
            ];
        }

        return $tempFiles;
    }

    /**
     * انتقال فایل از مسیر موقت به مسیر نهایی
     */
    public function moveTempFileToFinal(array $tempFile, int $letterId): ?array
    {
        try {
            $tempPath = $tempFile['temp_path'];
            $finalPath = "attachments/{$letterId}/{$tempFile['original_name']}";

            if (Storage::disk('public')->exists($tempPath)) {
                // اطمینان از وجود پوشه مقصد
                $finalDirectory = dirname($finalPath);
                if (!Storage::disk('public')->exists($finalDirectory)) {
                    Storage::disk('public')->makeDirectory($finalDirectory);
                }

                // انتقال فایل
                Storage::disk('public')->move($tempPath, $finalPath);

                return [
                    'file_path' => $finalPath,
                    'file_name' => $tempFile['original_name'],
                    'file_size' => $tempFile['size'],
                    'mime_type' => $tempFile['mime_type'],
                    'extension' => $tempFile['extension'],
                ];
            }
        } catch (\Exception $e) {
            Log::error('File move failed: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * ذخیره نامه در دیتابیس
     */
    protected function storeLetter(
        array  $data,
        User   $creator,
        array  $senderData,
        array  $recipientData,
        string $trackingNumber,
        string $letterNumber
    ): Letter {
        return Letter::create([
            'organization_id'   => $creator->organization_id,
            'letter_type'       => $data['recipient_type'] ?? 'internal',
            'letter_number'     => $letterNumber,
            'tracking_number'   => $trackingNumber,
            'security_level'    => $data['security_level'],
            'priority'          => $data['priority'],
            'category_id'       => $data['category_id'] ?? null,
            'subject'           => $data['subject'],
            'summary'           => $data['summary'] ?? null,
            'content'           => $data['content'] ?? null,
            'is_public'         => ($data['security_level'] ?? '') === 'public',

            'sender_name'           => $senderData['name'],
            'sender_position_name'  => $senderData['position_name'],
            'sender_department_id'  => $senderData['department_id'],
            'sender_user_id'        => $senderData['user_id'],
            'sender_position_id'    => $senderData['position_id'],
            'sender_organization_id' => $senderData['organization_id'],

            'recipient_type'            => $recipientData['type'],
            'recipient_organization_id' => $recipientData['organization_id'],
            'recipient_name'            => $recipientData['name'],
            'recipient_position_name'   => $recipientData['position_name'],
            'recipient_department_id'   => $recipientData['department_id'],
            'recipient_user_id'         => $recipientData['user_id'],
            'recipient_position_id'     => $recipientData['position_id'],

            'cc_recipients'     => $data['cc_recipients'] ?? [],
            'date'              => $data['date'] ?? now(),
            'due_date'          => $data['due_date'] ?? null,
            'response_deadline' => $data['response_deadline'] ?? null,
            'sheet_count'       => $data['sheet_count'] ?? 1,
            'is_draft'          => $data['is_draft'] ?? false,
            'final_status'      => ($data['is_draft'] ?? false) ? 'draft' : 'approved',
            'created_by'        => $creator->id,
        ]);
    }

    /**
     * ذخیره پاسخ نامه
     */
    protected function storeReply(
        array $data,
        Letter $original,
        User $creator,
        array $senderData,
        array $recipientData,
        string $trackingNumber,
        string $letterNumber,
        string $threadId
    ): Letter {
        return Letter::create([
            'organization_id'   => $creator->organization_id,
            'letter_type'       => $data['recipient_type'] ?? 'internal',
            'letter_number'     => $letterNumber,
            'tracking_number'   => $trackingNumber,
            'security_level'    => $data['security_level'] ?? $original->security_level,
            'priority'          => $data['priority'] ?? 'normal',
            'subject'           => $data['subject'],
            'content'           => $data['content'] ?? null,

            'sender_name'           => $senderData['name'],
            'sender_position_name'  => $senderData['position_name'],
            'sender_department_id'  => $senderData['department_id'],
            'sender_user_id'        => $senderData['user_id'],
            'sender_position_id'    => $senderData['position_id'],
            'sender_organization_id' => $senderData['organization_id'],

            'recipient_type'            => $recipientData['type'],
            'recipient_organization_id' => $recipientData['organization_id'],
            'recipient_name'            => $recipientData['name'],
            'recipient_position_name'   => $recipientData['position_name'],
            'recipient_department_id'   => $recipientData['department_id'],
            'recipient_user_id'         => $recipientData['user_id'],
            'recipient_position_id'     => $recipientData['position_id'],

            'cc_recipients'     => $data['cc_recipients'] ?? [],
            'date'              => $data['date'] ?? now(),
            'due_date'          => $data['due_date'] ?? null,
            'response_deadline' => $data['response_deadline'] ?? null,
            'sheet_count'       => $data['sheet_count'] ?? 1,
            'is_draft'          => $data['is_draft'] ?? false,
            'final_status'      => ($data['is_draft'] ?? false) ? 'draft' : 'approved',
            'created_by'        => $creator->id,

            'parent_letter_id'   => $original->id,
            'reply_to_letter_id' => $original->id,
            'thread_id'          => $threadId,
            'replied_by'         => $creator->id,
        ]);
    }

    /**
     * آماده‌سازی اطلاعات فرستنده
     */
    protected function prepareSenderData(User $creator): array
    {
        return [
            'name'          => $creator->full_name,
            'position_name' => $creator->primaryPosition?->name,
            'department_id' => $creator->department?->id,
            'user_id'       => $creator->id,
            'position_id'   => $creator->primaryPosition?->id,
            'organization_id' => $creator->organization_id,
        ];
    }

    /**
     * آماده‌سازی اطلاعات گیرنده
     */
    protected function prepareRecipientData(array $data): array
    {
        $recipientType = $data['recipient_type'] ?? 'internal';

        return [
            'type'                  => $recipientType,
            'organization_id'       => $data['recipient_organization_id'] ?? null,
            'department_id'         => $data['recipient_department_id'] ?? null,
            'position_id'           => $data['recipient_position_id'] ?? null,
            'user_id'               => $data['recipient_user_id'] ?? null,
            'name'                  => $data['recipient_name'] ?? null,
            'position_name'         => $data['recipient_position_name'] ?? null,
        ];
    }

    /**
     * ایجاد ارجاع اولیه
     */
    public function createInitialRouting(Letter $letter, ?int $recipientUserId, ?string $instruction): void
    {
        if (!$recipientUserId) {
            return;
        }

        // TODO: پیاده‌سازی منطق ارجاع
        // Routing::create([
        //     'letter_id' => $letter->id,
        //     'from_user_id' => $letter->sender_user_id,
        //     'to_user_id' => $recipientUserId,
        //     'instruction' => $instruction,
        //     'status' => 'pending',
        // ]);
    }

    /**
     * بررسی نیاز به ایجاد ارجاع برای پاسخ
     */
    public function shouldCreateRoutingForReply(array $recipientData, Letter $replyLetter): bool
    {
        if ($replyLetter->is_draft) {
            return false;
        }

        if (($recipientData['type'] ?? 'internal') === 'external') {
            return false;
        }

        return !empty($recipientData['user_id']);
    }

    /**
     * تولید شماره رهگیری
     */
    protected function generateTrackingNumber(): string
    {
        $prefix = date('Ymd');
        $lastLetter = Letter::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastLetter
            ? (intval(substr($lastLetter->tracking_number, -4)) + 1)
            : 1;

        return $prefix . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * تولید شماره نامه
     */
    protected function generateLetterNumber(array $data): string
    {
        if ($data['is_draft'] ?? false) {
            return 'DRAFT-' . time();
        }

        $prefix = 'LETR';
        $year   = date('Y');
        $count  = Letter::whereYear('created_at', $year)->count();

        return sprintf('%s-%s-%04d', $prefix, $year, $count + 1);
    }

    /**
     * ثبت خطا در لاگ
     */
    protected function logError(string $message, \Exception $e, array $context = []): void
    {
        Log::error($message, array_merge([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], $context));
    }
}
