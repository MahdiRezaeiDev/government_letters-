<?php

namespace App\Models;

use App\Casts\JalaliDateCast;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Letter extends Model
{
    use SoftDeletes;

    protected $table = 'letters';

    protected $fillable = [
        'organization_id',
        'letter_type',
        'letter_number',
        'tracking_number',
        'security_level',
        'priority',
        'category_id',
        'subject',
        'summary',
        'content',
        'is_public',
        'sender_user_id',
        'sender_position_id',
        'sender_department_id',
        'sender_name',
        'sender_position_name',
        'recipient_organization_id',
        'recipient_user_id',
        'recipient_position_id',
        'recipient_department_id',
        'recipient_name',
        'recipient_position_name',
        'cc_recipients',
        'date',
        'due_date',
        'response_deadline',
        'parent_letter_id',
        'thread_id',
        'is_follow_up',
        'follow_up_count',
        'sheet_count',
        'is_draft',
        'final_status',
        'created_by',
        'updated_by',

        // ✅ اضافه کردن فیلدهای جدید برای Reply و Follow-up
        'reply_to_letter_id',
        'replied_at',
        'replied_by',
        'next_follow_up_date',
        'last_follow_up_at',
        'follow_up_status',
        'follow_up_notes',
    ];

    protected $casts = [
        'cc_recipients' => 'array',
        'date' => JalaliDateCast::class,
        'due_date' => JalaliDateCast::class,
        'response_deadline' => JalaliDateCast::class,
        'replied_at' => 'datetime',
        'last_follow_up_at' => 'datetime',
        'next_follow_up_date' => 'date',
        'is_draft' => 'boolean',
        'is_public' => 'boolean',
        'is_follow_up' => 'boolean',
        'follow_up_count' => 'integer',
        'sheet_count' => 'integer',
        'letter_type' => 'string',
        'security_level' => 'string',
        'priority' => 'string',
        'final_status' => 'string',
        'follow_up_status' => 'string',
    ];

    // ─── Accessors ─────────────────────────────────────────────

    public function getPriorityLabelAttribute(): string
    {
        $labels = [
            'low' => 'کم',
            'normal' => 'عادی',
            'high' => 'مهم',
            'urgent' => 'فوری',
            'very_urgent' => 'خیلی فوری',
        ];
        return $labels[$this->priority] ?? $this->priority;
    }

    public function getPriorityColorAttribute(): string
    {
        $colors = [
            'low' => 'gray',
            'normal' => 'blue',
            'high' => 'yellow',
            'urgent' => 'orange',
            'very_urgent' => 'red',
        ];
        return $colors[$this->priority] ?? 'gray';
    }

    public function getSecurityLevelLabelAttribute(): string
    {
        $labels = [
            'public' => 'عمومی',
            'internal' => 'داخلی',
            'confidential' => 'محرمانه',
            'secret' => 'سری',
            'top_secret' => 'بسیار سری',
        ];
        return $labels[$this->security_level] ?? $this->security_level;
    }

    // ✅ اضافه کردن Accessor برای وضعیت تعقیب
    public function getFollowUpStatusLabelAttribute(): string
    {
        $labels = [
            'pending' => 'در انتظار',
            'in_progress' => 'در حال پیگیری',
            'completed' => 'تکمیل شده',
            'overdue' => 'تأخیر خورده',
            'cancelled' => 'لغو شده',
        ];
        return $labels[$this->follow_up_status] ?? 'در انتظار';
    }

    public function getFollowUpStatusColorAttribute(): string
    {
        $colors = [
            'pending' => 'yellow',
            'in_progress' => 'blue',
            'completed' => 'green',
            'overdue' => 'red',
            'cancelled' => 'gray',
        ];
        return $colors[$this->follow_up_status] ?? 'gray';
    }

    // ✅ بررسی می‌کند آیا این نامه جواب دارد؟
    public function getHasRepliesAttribute(): bool
    {
        return $this->replies()->exists();
    }

    // ✅ تعداد جواب‌ها
    public function getRepliesCountAttribute(): int
    {
        return $this->replies()->count();
    }

    // ✅ آیا این نامه نیاز به تعقیب دارد؟
    public function getNeedsFollowUpAttribute(): bool
    {
        return $this->is_follow_up &&
            $this->follow_up_status === 'pending' &&
            $this->next_follow_up_date &&
            $this->next_follow_up_date <= now();
    }

    // ─── Relationships ─────────────────────────────────────────

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(LetterCategory::class, 'category_id');
    }

    public function senderUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    public function senderPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'sender_position_id');
    }

    public function senderDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'sender_department_id');
    }

    public function senderOrganization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function recipientOrganization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'recipient_organization_id');
    }

    public function recipientUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function recipientPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'recipient_position_id');
    }

    public function recipientDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'recipient_department_id');
    }

    public function parentLetter(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'parent_letter_id');
    }

    public function childLetters(): HasMany
    {
        return $this->hasMany(Letter::class, 'parent_letter_id');
    }

    // ✅ رابطه برای نامه‌ای که به آن جواب داده شده
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'reply_to_letter_id');
    }

    // ✅ رابطه برای جواب‌های این نامه
    public function replies(): HasMany
    {
        return $this->hasMany(Letter::class, 'reply_to_letter_id');
    }

    // ✅ رابطه برای کاربری که جواب داده
    public function repliedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    // ✅ رابطه برای نامه اصلی که این نامه تعقیب می‌کند
    public function originalFollowUpLetter(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'is_follow_up');
    }

    // ✅ رابطه برای نامه‌های تعقیبی این نامه
    public function followUpLetters(): HasMany
    {
        return $this->hasMany(Letter::class, 'is_follow_up');
    }

    /**
     * رابطه با ارجاع‌ها
     */
    public function delegations()
    {
        return $this->hasMany(LetterDelegation::class, 'letter_id');
    }

    /**
     * آخرین ارجاع فعال (در انتظار یا پذیرفته شده)
     */
    public function activeDelegation()
    {
        return $this->hasOne(LetterDelegation::class, 'letter_id')
            ->whereIn('status', ['pending', 'accepted'])
            ->latest('delegated_at');
    }

    /**
     * آخرین ارجاع (هر وضعیتی)
     */
    public function latestDelegation()
    {
        return $this->hasOne(LetterDelegation::class, 'letter_id')
            ->latest('delegated_at');
    }

    /**
     * بررسی اینکه آیا این مکتوب به کاربر خاصی ارجاع شده است
     */
    public function isDelegatedTo(int $userId): bool
    {
        return $this->delegations()
            ->where('delegated_to_user_id', $userId)
            ->whereIn('status', ['pending', 'accepted'])
            ->exists();
    }

    /**
     * بررسی اینکه آیا این مکتوب ارجاع فعال دارد
     */
    public function hasActiveDelegation(): bool
    {
        return $this->delegations()
            ->whereIn('status', ['pending', 'accepted'])
            ->exists();
    }

    /**
     * دریافت کاربری که مکتوب به او ارجاع شده (در صورت وجود)
     */
    public function getDelegatedToUserAttribute()
    {
        $delegation = $this->activeDelegation;
        return $delegation ? $delegation->delegatedTo : null;
    }

    /**
     * دریافت کاربری که ارجاع را انجام داده
     */
    public function getDelegatedByUserAttribute()
    {
        $delegation = $this->latestDelegation;
        return $delegation ? $delegation->delegatedBy : null;
    }

    /**
     * دریافت دستورالعمل ارجاع
     */
    public function getDelegationNoteAttribute()
    {
        $delegation = $this->latestDelegation;
        return $delegation ? $delegation->delegated_note : null;
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(LetterHistory::class);
    }

    public function drafts(): HasMany
    {
        return $this->hasMany(DraftLetter::class);
    }

    public function routings(): HasMany
    {
        return $this->hasMany(Routing::class);
    }

    public function actions(): HasMany
    {
        return $this->hasManyThrough(Action::class, Routing::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(LetterView::class);
    }

    public function signatures(): HasMany
    {
        return $this->hasMany(LetterSignature::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(FavoriteLetter::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    public function cases(): BelongsToMany
    {
        return $this->belongsToMany(ArchiveCase::class, 'case_letters')
            ->withPivot('archived_at', 'archived_by')
            ->withTimestamps();
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeOutgoing($query, $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('sender_user_id', $user->id);
        });
    }

    public function scopeIncoming($query, $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('recipient_user_id', $user->id);
        });
    }

    public function scopeInternal($query)
    {
        return $query->where('letter_type', 'internal');
    }

    public function scopeExternal($query)
    {
        return $query->where('letter_type', 'external');
    }

    public function scopeDraft($query)
    {
        return $query->where('is_draft', true);
    }

    public function scopePublished($query)
    {
        return $query->where('is_draft', false);
    }

    // ✅ Scope برای نامه‌های نیازمند تعقیب
    public function scopeNeedsFollowUp($query)
    {
        return $query->where('is_follow_up', true)
            ->where('follow_up_status', 'pending')
            ->whereDate('next_follow_up_date', '<=', now());
    }

    // ✅ Scope برای نامه‌های در حال تعقیب
    public function scopeFollowUpPending($query)
    {
        return $query->where('is_follow_up', true)
            ->whereIn('follow_up_status', ['pending', 'in_progress']);
    }

    // ✅ Scope برای نامه‌های یک thread (گفتگو)
    public function scopeSameThread($query, $threadId)
    {
        return $query->where('thread_id', $threadId);
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where(function ($q) use ($departmentId) {
            $q->where('sender_department_id', $departmentId)
                ->orWhere('recipient_department_id', $departmentId);
        });
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('sender_user_id', $userId)
                ->orWhere('recipient_user_id', $userId)
                ->orWhere('created_by', $userId);
        });
    }

    public function parent()
    {
        return $this->belongsTo(Letter::class, 'parent_letter_id');
    }

    // ─── Boot ──────────────────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($letter) {
            if (!$letter->tracking_number) {
                $letter->tracking_number = static::generateTrackingNumber();
            }

            // تنظیم thread_id برای پاسخ‌ها
            if (!$letter->thread_id && $letter->reply_to_letter_id) {
                $parent = static::find($letter->reply_to_letter_id);
                $letter->thread_id = $parent?->thread_id ?? Str::uuid();
            } elseif (!$letter->thread_id && $letter->parent_letter_id) {
                $parent = static::find($letter->parent_letter_id);
                $letter->thread_id = $parent?->thread_id ?? Str::uuid();
            } elseif (!$letter->thread_id) {
                $letter->thread_id = Str::uuid();
            }

            // تنظیم follow_up_status پیش‌فرض
            if ($letter->is_follow_up && !$letter->follow_up_status) {
                $letter->follow_up_status = 'pending';
            }
        });

        // ✅ وقتی نامه جواب داده می‌شود
        static::created(function ($letter) {
            if ($letter->reply_to_letter_id) {
                $original = static::find($letter->reply_to_letter_id);
                if ($original && !$original->replied_at) {
                    $original->update([
                        'replied_at' => now(),
                        'replied_by' => $letter->created_by,
                    ]);
                }
            }
        });
    }

    // ─── Helpers ───────────────────────────────────────────────

    protected static function generateTrackingNumber(): string
    {
        return 'TRK-' . now()->format('Ymd') . '-' . Str::random(8);
    }

    public function isArchived(): bool
    {
        return $this->final_status === 'archived';
    }

    public function isPending(): bool
    {
        return $this->final_status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->final_status === 'approved';
    }

    public function isDraft(): bool
    {
        return $this->is_draft;
    }

    public function canBeEditedBy(User $user): bool
    {
        return $this->is_draft && $this->created_by === $user->id;
    }

    // ✅ آیا کاربر می‌تواند به این نامه جواب دهد؟
    public function canBeRepliedBy(User $user): bool
    {
        // فقط نامه‌های غیر پیش‌نویس و منتشر شده
        if ($this->is_draft) {
            return false;
        }

        // کاربر باید گیرنده یا فرستنده یا creator باشد
        return in_array($user->id, [
            $this->recipient_user_id,
            $this->sender_user_id,
            $this->created_by,
        ]);
    }

    // ✅ دریافت کل thread (گفتگو)
    public function getThreadLetters()
    {
        return static::where('thread_id', $this->thread_id)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    // ✅ دریافت آخرین جواب در thread
    public function getLastReply()
    {
        return static::where('reply_to_letter_id', $this->id)
            ->orWhere('thread_id', $this->thread_id)
            ->latest()
            ->first();
    }

    // ✅ بروزرسانی وضعیت تعقیب
    public function updateFollowUpStatus(string $status, ?string $notes = null): bool
    {
        $this->follow_up_status = $status;

        if ($notes) {
            $this->follow_up_notes = $notes;
        }

        if ($status === 'completed') {
            $this->is_follow_up = false;
            $this->last_follow_up_at = now();
        }

        return $this->save();
    }

    // ✅ ایجاد تعقیب جدید برای نامه
    public function createFollowUp(array $data): self
    {
        $this->is_follow_up = true;
        $this->follow_up_count = ($this->follow_up_count ?? 0) + 1;
        $this->next_follow_up_date = $data['next_follow_up_date'] ?? now()->addDays(7);
        $this->follow_up_status = $data['follow_up_status'] ?? 'pending';
        $this->follow_up_notes = $data['follow_up_notes'] ?? null;
        $this->save();

        return $this;
    }
}
