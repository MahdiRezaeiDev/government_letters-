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
            // آماده‌سازی داده‌های فرستنده (همیشه از کاربر جاری)
            $senderData = $this->prepareSenderData($creator);

            // آماده‌سازی داده‌های گیرنده (داخلی یا خارجی)
            $recipientData = $this->prepareRecipientData($data);

            // تولید شماره‌های نامه
            $trackingNumber = $this->generateTrackingNumber();
            $letterNumber   = $this->generateLetterNumber($data);



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

            // ایجاد ارجاع اولیه (فقط برای گیرنده داخلی با user_id)
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

        \Log::info('Attempting to create letter with data:', [
            'organization_id' => $creator->organization_id,
            'letter_type' => $data['recipient_type'] ?? 'external',
            'recipient_data' => $recipientData,
            'is_draft' => $data['is_draft'] ?? false,
        ]);

        try {
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

                // فرستنده
                'sender_name'           => $senderData['name'],
                'sender_position_name'  => $senderData['position_name'],
                'sender_department_id'  => $senderData['department_id'],
                'sender_user_id'        => $senderData['user_id'],
                'sender_position_id'    => $senderData['position_id'],
                'sender_organization_id' => $senderData['organization_id'],

                // گیرنده - فیلدهای یکپارچه
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
        } catch (\Exception $e) {
            \Log::error('Letter creation failed in storeLetter:', [
                'error' => $e->getMessage(),
                'sql' => $e->getPrevious()?->getMessage(),
            ]);
            throw $e;
        }
    }


    public function createReply(array $data, Letter $originalLetter, User $creator): Letter
    {
        DB::beginTransaction();

        try {
            // ۱. آماده‌سازی داده‌های فرستنده و گیرنده
            $senderData = $this->prepareSenderData($creator);
            $recipientData = $this->prepareRecipientData($data);

            // ۲. تولید شماره‌های نامه
            $trackingNumber = $this->generateTrackingNumber();
            $letterNumber   = $this->generateLetterNumber($data);

            // ۳. اضافه کردن اطلاعات رابطه به داده‌ها
            // اگر نامه اصلی خودش thread_id ندارد، از UUID خودش استفاده می‌کنیم (یا ایجاد می‌کنیم)
            $threadId = $originalLetter->thread_id ?? $originalLetter->uuid ?? \Illuminate\Support\Str::uuid();

            // ۴. ایجاد نامه پاسخ با استفاده از متد storeLetter
            // نکته: متد storeLetter باید برای پذیرش فیلدهای اضافی مثل parent_letter_id اصلاح شود
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

            // ۵. آپلود پیوست‌های نامه پاسخ
            if (!empty($data['attachments'])) {
                $this->handleAttachments($replyLetter, $data['attachments'], $creator);
            }

            // ۶. به‌روزرسانی وضعیت نامه اصلی (که به آن پاسخ داده شده)
            if (!($data['is_draft'] ?? false)) {
                $originalLetter->update([
                    'replied_at' => now(),
                    'replied_by' => $creator->id,
                ]);
            }

            // ۷. ایجاد ارجاع (Routing) در صورت نیاز
            if ($this->shouldCreateRouting($data, $recipientData)) {
                $this->createInitialRouting($replyLetter, $recipientData['user_id'], $data['instruction'] ?? null);
            }

            DB::commit();
            return $replyLetter;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Reply creation failed', $e);
            throw $e;
        }
    }

    /**
     * آماده‌سازی اطلاعات فرستنده از کاربر جاری
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

    protected function prepareRecipientData(array $data): array
    {
        $recipientType = $data['recipient_type'] ?? 'internal';

        // داده‌های پایه یکسان برای هر دو نوع گیرنده
        return [
            'type'                  => $recipientType,
            'organization_id'       => $data['recipient_organization_id'] ?? null,
            'department_id'         => $data['recipient_department_id'] ?? null,
            'position_id'           => $data['recipient_position_id'] ?? null,
            'user_id'               => ($data['recipient_user_id'] ?? null),
            'name'                  => $data['recipient_name'] ?? null,
            'position_name'         => $data['recipient_position_name'] ?? null,
        ];
    }


    protected function storeReply(
        array $data,
        Letter $original,
        User $creator,
        $senderData,
        $recipientData,
        $tracking,
        $number,
        $threadId
    ): Letter {
        return Letter::create([
            'organization_id'   => $creator->organization_id,
            'letter_type'       => $data['recipient_type'] ?? 'internal',
            'letter_number'     => $number,
            'tracking_number'   => $tracking,
            'security_level'    => $data['security_level'] ?? $original->security_level,
            'priority'          => $data['priority'] ?? 'normal',
            'subject'           => $data['subject'],
            'content'           => $data['content'] ?? null,

            // فرستنده
            'sender_name'           => $senderData['name'],
            'sender_position_name'  => $senderData['position_name'],
            'sender_department_id'  => $senderData['department_id'],
            'sender_user_id'        => $senderData['user_id'],
            'sender_position_id'    => $senderData['position_id'],
            'sender_organization_id' => $senderData['organization_id'],

            // گیرنده - فیلدهای یکپارچه
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
            'final_status'      => ($data['is_draft'] ?? false) ? 'draft' : 'pending',
            'created_by'        => $creator->id,

            // فیلدهای کلیدی پاسخ و زنجیره
            'parent_letter_id'   => $original->id, // نامه والد
            'reply_to_letter_id' => $original->id, // نامه‌ای که مستقیماً به آن پاسخ داده شده
            'thread_id'          => $threadId,      // شناسه زنجیره گفتگو
            'reply_at'           => $data['date'] ?? now(),
            'replied_by'         => $creator->id,
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
                    'letter_id'  => $letter->id,
                    'user_id'    => $uploader->id,
                    'file_name'  => $file->getClientOriginalName(),
                    'file_path'  => $path,
                    'file_size'  => $file->getSize(),
                    'mime_type'  => $file->getMimeType(),
                    'extension'  => $file->getClientOriginalExtension(),
                ]);
            } catch (\Exception $e) {
                $this->logError('Attachment upload failed', $e, [
                    'letter_id' => $letter->id,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }
    }

    /**
     * ایجاد ارجاع اولیه (فقط برای گیرنده داخلی)
     */
    protected function createInitialRouting(Letter $letter, ?int $recipientUserId, ?string $instruction): void
    {
        if (!$recipientUserId) {
            return;
        }

        // منطق ارجاع را اینجا یا در RoutingService جداگانه پیاده کنید
        // مثال:
        // Routing::create([
        //     'letter_id' => $letter->id,
        //     'from_user_id' => $letter->sender_user_id,
        //     'to_user_id' => $recipientUserId,
        //     'instruction' => $instruction,
        //     'status' => 'pending',
        // ]);
    }

    /**
     * بررسی نیاز به ایجاد ارجاع
     * فقط وقتی گیرنده داخلی با user_id باشد ارجاع ایجاد می‌شود
     */
    protected function shouldCreateRouting(array $data, array $recipientData): bool
    {
        $isExternal = ($data['recipient_type'] ?? 'internal') === 'external';
        $isDraft = $data['is_draft'] ?? false;
        $hasRecipientUser = !empty($recipientData['user_id']);
        $isIncoming = ($data['letter_type'] ?? '') === 'incoming';

        // برای پیش‌نویس یا گیرنده خارجی یا نامه‌های ورودی، ارجاع ایجاد نکن
        if ($isDraft || $isExternal || $isIncoming) {
            return false;
        }

        // فقط برای گیرنده داخلی با user_id معتبر
        return $hasRecipientUser;
    }

    /**
     * تولید شماره رهگیری یکتا
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
