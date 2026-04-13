<?php

namespace App\Models;

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
    ];

    protected $casts = [
        'cc_recipients' => 'array',
        'date' => 'date',
        'due_date' => 'date',
        'response_deadline' => 'date',
        'is_draft' => 'boolean',
        'is_public' => 'boolean',
        'follow_up_count' => 'integer',
        'sheet_count' => 'integer',
        'letter_type' => 'string',
        'security_level' => 'string',
        'priority' => 'string',
        'final_status' => 'string',
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

    // ─── Relationships ─────────────────────────────────────────

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function attachments(): HasMany {
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

    public function followUp(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'is_follow_up');
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

    public function scopeIncoming($query)
    {
        return $query->where('letter_type', 'incoming');
    }

    public function scopeOutgoing($query)
    {
        return $query->where('letter_type', 'outgoing');
    }

    public function scopeInternal($query)
    {
        return $query->where('letter_type', 'internal');
    }

    public function scopeDraft($query)
    {
        return $query->where('is_draft', true);
    }

    public function scopePublished($query)
    {
        return $query->where('is_draft', false);
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

    // ─── Boot ──────────────────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($letter) {
            if (!$letter->tracking_number) {
                $letter->tracking_number = static::generateTrackingNumber();
            }

            if (!$letter->thread_id && $letter->parent_letter_id) {
                $parent = static::find($letter->parent_letter_id);
                $letter->thread_id = $parent?->thread_id ?? Str::uuid();
            } elseif (!$letter->thread_id) {
                $letter->thread_id = Str::uuid();
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

    public function canBeEditedBy(User $user): bool
    {
        return $this->is_draft && $this->created_by === $user->id;
    }
}