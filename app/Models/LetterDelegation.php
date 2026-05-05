<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterDelegation extends Model
{
    /**
     * نام جدول
     */
    protected $table = 'letter_delegations';

    /**
     * فیلدهای قابل پر کردن (Mass Assignment)
     */
    protected $fillable = [
        'letter_id',
        'delegated_by_user_id',
        'delegated_to_user_id',
        'delegated_note',
        'status',
        'delegated_at',
        'accepted_at',
        'replied_at',
        'created_by'
    ];

    /**
     * فیلدهایی که باید به عنوان تاریخ در نظر گرفته شوند
     */
    protected $casts = [
        'delegated_at' => 'datetime',
        'accepted_at' => 'datetime',
        'replied_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * مقادیر پیش‌فرض
     */
    protected $attributes = [
        'status' => 'pending',
    ];

    // ==================== روابط (Relations) ====================

    /**
     * رابطه با مکتوب
     */
    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'letter_id');
    }

    /**
     * شخصی که ارجاع می‌دهد (گیرنده اصلی)
     */
    public function delegatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delegated_by_user_id');
    }

    /**
     * شخصی که به او ارجاع می‌شود (همکار)
     */
    public function delegatedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delegated_to_user_id');
    }

    /**
     * ثبت‌کننده ارجاع
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ==================== متدهای کمکی (Helpers) ====================

    /**
     * آیا ارجاع در حالت انتظار است؟
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * آیا ارجاع پذیرفته شده است؟
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * آیا پاسخ داده شده است؟
     */
    public function isReplied(): bool
    {
        return $this->status === 'replied';
    }

    /**
     * آیا ارجاع رد شده است؟
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * آیا ارجاع منقضی شده است؟
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired';
    }

    /**
     * آیا ارجاع فعال است (پاسخ داده نشده و رد نشده و منقضی نشده)؟
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['pending', 'accepted']);
    }

    // ==================== متدهای عملیاتی (Actions) ====================

    /**
     * پذیرش ارجاع توسط همکار
     */
    public function accept(): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        return $this->update([
            'status' => 'accepted',
            'accepted_at' => now()
        ]);
    }

    /**
     * ثبت پاسخ توسط همکار
     */
    public function markAsReplied(): bool
    {
        if (!$this->isAccepted()) {
            return false;
        }

        return $this->update([
            'status' => 'replied',
            'replied_at' => now()
        ]);
    }

    /**
     * رد ارجاع توسط همکار
     */
    public function reject(): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        return $this->update([
            'status' => 'rejected'
        ]);
    }

    /**
     * منقضی کردن ارجاع
     */
    public function expire(): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        return $this->update([
            'status' => 'expired'
        ]);
    }

    // ==================== اسکوپ‌ها (Scopes) ====================

    /**
     * اسکوپ ارجاع‌های فعال (در انتظار یا پذیرفته شده)
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'accepted']);
    }

    /**
     * اسکوپ ارجاع‌های در انتظار
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * اسکوپ ارجاع‌های پاسخ داده شده
     */
    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }

    /**
     * اسکوپ ارجاع‌های یک شخص (به عنوان ارجاع گیرنده)
     */
    public function scopeDelegatedToUser($query, int $userId)
    {
        return $query->where('delegated_to_user_id', $userId);
    }

    /**
     * اسکوپ ارجاع‌های یک شخص (به عنوان ارجاع دهنده)
     */
    public function scopeDelegatedByUser($query, int $userId)
    {
        return $query->where('delegated_by_user_id', $userId);
    }

    /**
     * اسکوپ ارجاع‌های مربوط به یک مکتوب
     */
    public function scopeForLetter($query, int $letterId)
    {
        return $query->where('letter_id', $letterId);
    }
}
