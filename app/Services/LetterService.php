<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\User;
use App\Models\Attachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

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
     * ایجاد پاسخ به نامه موجود
     */
    public function createReply(array $data, Letter $parentLetter, User $replyCreator): Letter
    {
        DB::beginTransaction();

        try {
            // آماده‌سازی داده‌های فرستنده (کاربری که پاسخ می‌دهد)
            $senderData = $this->prepareSenderData($replyCreator);

            // تعیین گیرنده پاسخ بر اساس نامه اصلی
            $recipientData = $this->prepareReplyRecipientData($data, $parentLetter, $replyCreator);

            // تولید شماره‌های نامه
            $trackingNumber = $this->generateTrackingNumber();
            $letterNumber   = $this->generateLetterNumber($data);

            // تنظیم موضوع پاسخ
            $subject = $data['subject'] ?? ($parentLetter->subject && !Str::startsWith($parentLetter->subject, 'پاسخ:')
                ? 'پاسخ: ' . $parentLetter->subject
                : $parentLetter->subject);

            // ایجاد نامه پاسخ
            $reply = Letter::create([
                'organization_id'   => $parentLetter->organization_id,
                'letter_type'       => $parentLetter->letter_type,
                'letter_number'     => $letterNumber,
                'tracking_number'   => $trackingNumber,
                'security_level'    => $data['security_level'] ?? $parentLetter->security_level,
                'priority'          => $data['priority'] ?? $parentLetter->priority,
                'category_id'       => $data['category_id'] ?? $parentLetter->category_id,
                'subject'           => $subject,
                'summary'           => $data['summary'] ?? null,
                'content'           => $data['content'],
                'is_public'         => ($data['security_level'] ?? $parentLetter->security_level) === 'public',

                // فرستنده
                'sender_name'           => $senderData['name'],
                'sender_position_name'  => $senderData['position_name'],
                'sender_department_id'  => $senderData['department_id'],
                'sender_user_id'        => $senderData['user_id'],
                'sender_position_id'    => $senderData['position_id'],

                // گیرنده
                'recipient_type'            => $recipientData['type'] ?? $parentLetter->letter_type,
                'recipient_organization_id' => $recipientData['organization_id'] ?? null,
                'recipient_name'            => $recipientData['name'],
                'recipient_position_name'   => $recipientData['position_name'] ?? null,
                'recipient_department_id'   => $recipientData['department_id'] ?? null,
                'recipient_user_id'         => $recipientData['user_id'] ?? null,
                'recipient_position_id'     => $recipientData['position_id'] ?? null,

                'cc_recipients'     => $data['cc_recipients'] ?? [],
                'date'              => $data['date'] ?? now(),
                'due_date'          => $data['due_date'] ?? null,
                'response_deadline' => $data['response_deadline'] ?? null,
                'sheet_count'       => $data['sheet_count'] ?? 1,
                'is_draft'          => $data['is_draft'] ?? false,
                'final_status'      => ($data['is_draft'] ?? false) ? 'draft' : 'pending',
                'created_by'        => $replyCreator->id,

                // ارتباط با نامه اصلی
                'parent_letter_id'  => $parentLetter->id,
                'thread_id'         => $parentLetter->thread_id ?? Str::uuid(),

                // فیلدهای تعقیب
                'is_follow_up'      => $data['is_follow_up'] ?? false,
                'follow_up_count'   => 0,
                'next_follow_up_date' => $data['next_follow_up_date'] ?? null,
                'follow_up_status'  => ($data['is_follow_up'] ?? false) ? 'pending' : 'pending', 
                'follow_up_notes'   => $data['follow_up_notes'] ?? null,
            ]);

            // آپلود پیوست‌ها
            if (!empty($data['attachments'])) {
                $this->handleAttachments($reply, $data['attachments'], $replyCreator);
            }

            // ایجاد ارجاع برای پاسخ (اگر گیرنده کاربر داخلی باشد)
            if (!empty($recipientData['user_id'])) {
                $this->createInitialRouting($reply, $recipientData['user_id'], $data['instruction'] ?? null);
            }

            // اگر پاسخ از نوع تعقیب است و نامه اصلی نیاز به تعقیب دارد، وضعیت را به روز کن
            if (($data['is_follow_up'] ?? false) && $parentLetter->is_follow_up) {
                $parentLetter->update([
                    'follow_up_status' => 'completed',
                    'last_follow_up_at' => now(),
                    'follow_up_count' => $parentLetter->follow_up_count + 1,
                ]);
            }

            DB::commit();

            return $reply;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Reply creation failed', $e, ['parent_letter_id' => $parentLetter->id]);
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
        ];
    }

    /**
     * آماده‌سازی اطلاعات گیرنده برای پاسخ
     */
    protected function prepareReplyRecipientData(array $data, Letter $parentLetter, User $replyCreator): array
    {
        // اگر در فرم پاسخ، گیرنده مشخص شده، از آن استفاده کن
        if (isset($data['recipient_user_id']) || isset($data['recipient_name'])) {
            return [
                'type'                  => $data['recipient_type'] ?? $parentLetter->letter_type,
                'organization_id'       => $data['recipient_organization_id'] ?? $parentLetter->recipient_organization_id,
                'department_id'         => $data['recipient_department_id'] ?? $parentLetter->recipient_department_id,
                'position_id'           => $data['recipient_position_id'] ?? $parentLetter->recipient_position_id,
                'user_id'               => $data['recipient_user_id'] ?? $parentLetter->recipient_user_id,
                'name'                  => $data['recipient_name'] ?? $parentLetter->recipient_name,
                'position_name'         => $data['recipient_position_name'] ?? $parentLetter->recipient_position_name,
            ];
        }

        // در غیر این صورت، بر اساس نامه اصلی تعیین کن
        if ($parentLetter->letter_type === 'internal') {
            // نامه داخلی: پاسخ به فرستنده اصلی
            return [
                'type'          => 'internal',
                'department_id' => $parentLetter->sender_department_id,
                'position_id'   => $parentLetter->sender_position_id,
                'user_id'       => $parentLetter->sender_user_id,
                'name'          => $parentLetter->sender_name,
                'position_name' => $parentLetter->sender_position_name,
            ];
        } else {
            // نامه خارجی: پاسخ به فرستنده اصلی
            return [
                'type'          => 'external',
                'organization_id' => $parentLetter->recipient_organization_id ?? $parentLetter->organization_id,
                'name'          => $parentLetter->sender_name,
                'position_name' => $parentLetter->sender_position_name,
                'department_id' => $parentLetter->sender_department_id,
                'user_id'       => null, // نامه خارجی کاربر داخلی ندارد
            ];
        }
    }

    /**
     * آماده‌سازی اطلاعات گیرنده (داخلی یا خارجی)
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

            // فرستنده
            'sender_name'           => $senderData['name'],
            'sender_position_name'  => $senderData['position_name'],
            'sender_department_id'  => $senderData['department_id'],
            'sender_user_id'        => $senderData['user_id'],
            'sender_position_id'    => $senderData['position_id'],

            // گیرنده
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

        // بررسی وجود مدل Routing
        if (class_exists(\App\Models\Routing::class)) {
            \App\Models\Routing::create([
                'letter_id'    => $letter->id,
                'from_user_id' => $letter->sender_user_id,
                'to_user_id'   => $recipientUserId,
                'instruction'  => $instruction,
                'action_type'  => 'action',
                'status'       => 'pending',
                'created_by'   => $letter->created_by,
            ]);
        }
    }

    /**
     * بررسی نیاز به ایجاد ارجاع
     */
    protected function shouldCreateRouting(array $data, array $recipientData): bool
    {
        $isExternal = ($data['recipient_type'] ?? 'internal') === 'external';
        $isDraft = $data['is_draft'] ?? false;
        $hasRecipientUser = !empty($recipientData['user_id']);

        if ($isDraft || $isExternal) {
            return false;
        }

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
