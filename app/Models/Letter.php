<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany, BelongsToMany};
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'draft_content' => 'array',
        'cc_recipients' => 'array',
        'date' => 'date',
        'due_date' => 'date',
        'response_deadline' => 'date',
        'is_draft' => 'boolean',
    ];

    // ─── Relationships ───────────────────────────────────────────
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(LetterCategory::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function routings(): HasMany
    {
        return $this->hasMany(Routing::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function responseTo(): BelongsTo
    {
        return $this->belongsTo(Letter::class, 'is_response_to');
    }

    public function keywords(): BelongsToMany
    {
        return $this->belongsToMany(Keyword::class, 'letter_keywords');
    }

    public function files(): BelongsToMany
    {
        return $this->belongsToMany(File::class, 'letter_files');
    }

    // ─── Scopes ──────────────────────────────────────────────────
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

    public function scopeForOrganization($query, int $orgId)
    {
        return $query->where('organization_id', $orgId);
    }

    public function scopePending($query)
    {
        return $query->where('final_status', 'pending');
    }

    // ─── Accessors ───────────────────────────────────────────────
    public function getTypeColorAttribute(): string
    {
        return match($this->letter_type) {
            'incoming' => 'blue',
            'outgoing' => 'green',
            'internal' => 'purple',
            default    => 'gray',
        };
    }

    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'very_urgent' => 'red',
            'urgent'      => 'orange',
            'high'        => 'yellow',
            'normal'      => 'blue',
            'low'         => 'gray',
            default       => 'gray',
        };
    }
}