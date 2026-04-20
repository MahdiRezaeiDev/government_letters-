<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\User;
use App\Models\Attachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class LetterService
{
    /**
     * ایجاد یک نامه جدید
     */
    public function createLetter(array $data, User $creator): Letter
    {
        DB::beginTransaction();

        try {
            // آماده‌سازی داده‌های فرستنده
            $senderData = $this->prepareSenderData($creator);

            // آماده‌سازی داده‌های گیرنده
            $recipientData = $this->prepareRecipientData($data, $creator);

            // تولید شماره‌های نامه
            $trackingNumber = $this->generateTrackingNumber();
            $letterNumber = $this->generateLetterNumber($data);

            // ایجاد نامه
            $letter = $this->storeLetter(
                $data,
                $creator,
                $senderData,
                $recipientData,
                $trackingNumber,
                $letterNumber
            );

            // آپلود پیوست‌ها
            if (!empty($data['attachments'])) {
                $this->handleAttachments($letter, $data['attachments'], $creator);
            }

            // ایجاد ارجاع اولیه
            if ($this->shouldCreateRouting($data, $recipientData)) {
                $this->createInitialRouting($letter, $recipientData['user_id'], $data['instruction'] ?? null);
            }

            DB::commit();

            return $letter;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Letter creation failed', $e);
            throw $e;
        }
    }

    /**
     * آماده‌سازی اطلاعات فرستنده
     */
    protected function prepareSenderData(User $creator): array
    {
        return [
            'name' => $creator->full_name,
            'position_name' => $creator->primaryPosition?->name,
            'department_id' => $creator->department?->id,
            'user_id' => $creator->id,
            'position_id' => $creator->primaryPosition?->id,
        ];
    }

    /**
     * آماده‌سازی اطلاعات گیرنده
     */
    protected function prepareRecipientData(array $data, User $creator): array
    {
        $isInternal = ($data['recipient_type'] ?? 'internal') === 'internal';

        return [
            'name' => $isInternal ? ($data['recipient_name'] ?? null) : null,
            'position_name' => $isInternal ? ($data['recipient_position_name'] ?? null) : null,
            'department_id' => $isInternal ? ($data['recipient_department_id'] ?? null) : null,
            'user_id' => $isInternal ? ($data['recipient_user_id'] ?? null) : null,
            'position_id' => $isInternal ? ($data['recipient_position_id'] ?? null) : null,
        ];
    }

    /**
     * ذخیره نامه در دیتابیس
     */
    protected function storeLetter(
        array $data,
        User $creator,
        array $senderData,
        array $recipientData,
        string $trackingNumber,
        string $letterNumber
    ): Letter {
        return Letter::create([
            'organization_id' => $creator->organization_id,
            'letter_type' => $data['letter_type'] ?? 'internal',
            'letter_number' => $letterNumber,
            'tracking_number' => $trackingNumber,
            'security_level' => $data['security_level'],
            'priority' => $data['priority'],
            'category_id' => $data['category_id'] ?? null,
            'subject' => $data['subject'],
            'summary' => $data['summary'] ?? null,
            'content' => $data['content'] ?? null,
            'is_public' => ($data['security_level'] ?? '') === 'public',

            // فرستنده
            'sender_name' => $senderData['name'],
            'sender_position_name' => $senderData['position_name'],
            'sender_department_id' => $senderData['department_id'],
            'sender_user_id' => $senderData['user_id'],
            'sender_position_id' => $senderData['position_id'],

            // گیرنده
            'recipient_name' => $recipientData['name'],
            'recipient_position_name' => $recipientData['position_name'],
            'recipient_department_id' => $recipientData['department_id'],
            'recipient_user_id' => $recipientData['user_id'],
            'recipient_position_id' => $recipientData['position_id'],

            'cc_recipients' => $data['cc_recipients'] ?? [],
            'date' => $data['date'] ?? now(),
            'due_date' => $data['due_date'] ?? null,
            'response_deadline' => $data['response_deadline'] ?? null,
            'sheet_count' => $data['sheet_count'] ?? 1,
            'is_draft' => $data['is_draft'] ?? false,
            'final_status' => ($data['is_draft'] ?? false) ? 'draft' : 'pending',
            'created_by' => $creator->id,
        ]);
    }

    /**
     * مدیریت آپلود پیوست‌ها
     */
    protected function handleAttachments(Letter $letter, array $files, User $uploader): void
    {
        foreach ($files as $file) {
            if (!$file instanceof UploadedFile || !$file->isValid()) {
                continue;
            }

            try {
                $path = $file->store("attachments/{$letter->id}", 'public');

                Attachment::create([
                    'letter_id' => $letter->id,
                    'user_id' => $uploader->id,
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension(),
                ]);
            } catch (\Exception $e) {
                $this->logError('Attachment upload failed', $e, [
                    'letter_id' => $letter->id,
                    'file_name' => $file->getClientOriginalName()
                ]);
            }
        }
    }

    /**
     * ایجاد ارجاع اولیه
     */
    protected function createInitialRouting(Letter $letter, ?int $recipientUserId, ?string $instruction): void
    {
        if (!$recipientUserId) {
            return;
        }

        // منطق ایجاد ارجاع را اینجا قرار دهید
        // می‌توانید از یک سرویس جداگانه RoutingService استفاده کنید
    }

    /**
     * بررسی نیاز به ایجاد ارجاع
     */
    protected function shouldCreateRouting(array $data, array $recipientData): bool
    {
        return !($data['is_draft'] ?? false)
            && !empty($recipientData['user_id'])
            && ($data['letter_type'] ?? '') !== 'incoming';
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

        $sequence = $lastLetter ? (intval(substr($lastLetter->tracking_number, -4)) + 1) : 1;

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

        $prefix = match ($data['letter_type'] ?? 'internal') {
            'incoming' => 'INC',
            'outgoing' => 'OUT',
            default => 'INT'
        };

        $year = date('Y');
        $count = Letter::where('letter_type', $data['letter_type'])
            ->whereYear('created_at', $year)
            ->count();

        return sprintf('%s-%s-%04d', $prefix, $year, $count + 1);
    }

    /**
     * ثبت خطا
     */
    protected function logError(string $message, \Exception $e, array $context = []): void
    {
        Log::error($message, array_merge([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], $context));
    }
}
