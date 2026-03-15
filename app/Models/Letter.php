<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Letter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id', 'letter_type', 'letter_number', 'tracking_number',
        'security_level', 'priority', 'category_id', 'subject', 'summary',
        'content', 'draft_content', 'sender_type', 'sender_id', 'sender_name',
        'sender_position', 'recipient_type', 'recipient_id', 'recipient_name',
        'recipient_position', 'cc_recipients', 'date', 'due_date',
        'response_deadline', 'is_response_to', 'is_follow_up', 'follow_up_count',
        'sheet_count', 'is_draft', 'draft_of', 'draft_step', 'final_status',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'draft_content'  => 'array',
        'cc_recipients'  => 'array',
        'date'           => 'date',
        'due_date'       => 'date',
        'response_deadline' => 'date',
        'is_draft'       => 'boolean',
    ];

    // ===== روابط =====

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(LetterCategory::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function routings(): HasMany
    {
        return $this->hasMany(Routing::class);
    }

    public function keywords(): BelongsToMany
    {
        return $this->belongsToMany(Keyword::class, 'letter_keywords');
    }

    public function responseToLetter(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'is_response_to');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Letter::class, 'is_response_to');
    }

    public function followUpLetter(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'is_follow_up');
    }

    public function archiveFiles(): BelongsToMany
    {
        return $this->belongsToMany(ArchiveFile::class, 'letter_files', 'letter_id', 'file_id');
    }

    // ===== متدهای کمکی =====

    /**
     * برچسب نوع نامه به فارسی
     */
    public function getLetterTypeLabel(): string
    {
        return match($this->letter_type) {
            'incoming' => 'وارده',
            'outgoing' => 'صادره',
            'internal' => 'داخلی',
            default    => $this->letter_type,
        };
    }

    /**
     * برچسب اولویت به فارسی
     */
    public function getPriorityLabel(): string
    {
        return match($this->priority) {
            'low'        => 'کم',
            'normal'     => 'عادی',
            'high'       => 'مهم',
            'urgent'     => 'فوری',
            'very_urgent'=> 'خیلی فوری',
            default      => $this->priority,
        };
    }

    /**
     * برچسب سطح امنیت به فارسی
     */
    public function getSecurityLevelLabel(): string
    {
        return match($this->security_level) {
            'public'       => 'عمومی',
            'internal'     => 'داخلی',
            'confidential' => 'محرمانه',
            'secret'       => 'سری',
            'top_secret'   => 'بسیار سری',
            default        => $this->security_level,
        };
    }

    /**
     * رنگ اولویت برای UI
     */
    public function getPriorityColor(): string
    {
        return match($this->priority) {
            'low'        => 'gray',
            'normal'     => 'blue',
            'high'       => 'yellow',
            'urgent'     => 'orange',
            'very_urgent'=> 'red',
            default      => 'blue',
        };
    }

    /**
     * آخرین ارجاع فعال
     */
    public function activeRouting()
    {
        return $this->routings()->whereIn('status', ['pending', 'in_progress'])->latest()->first();
    }

    /**
     * اسکوپ: نامه‌های وارده
     */
    public function scopeIncoming($query)
    {
        return $query->where('letter_type', 'incoming');
    }

    /**
     * اسکوپ: نامه‌های صادره
     */
    public function scopeOutgoing($query)
    {
        return $query->where('letter_type', 'outgoing');
    }

    /**
     * اسکوپ: نامه‌های داخلی
     */
    public function scopeInternal($query)
    {
        return $query->where('letter_type', 'internal');
    }

    /**
     * اسکوپ: نامه‌های تأیید شده (نه پیش‌نویس)
     */
    public function scopeFinalized($query)
    {
        return $query->where('is_draft', false)->where('final_status', '!=', 'draft');
    }
}
