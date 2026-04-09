<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Routing extends Model
{
    use SoftDeletes;

    protected $table = 'routings';

    protected $fillable = [
        'letter_id',
        'from_position_id',
        'from_user_id',
        'to_position_id',
        'to_user_id',
        'action_type',
        'instruction',
        'deadline',
        'status',
        'completed_at',
        'completed_note',
        'priority',
        'step_order',
        'is_parallel',
        'parallel_group_id',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'completed_at' => 'datetime',
        'is_parallel' => 'boolean',
        'priority' => 'integer',
        'step_order' => 'integer',
    ];

    // ─── Accessors ─────────────────────────────────────────────

    public function getActionLabelAttribute(): string
    {
        $labels = [
            'action' => 'اقدام',
            'information' => 'اطلاع',
            'approval' => 'تأیید',
            'coordination' => 'هماهنگی',
            'sign' => 'امضاء',
        ];
        return $labels[$this->action_type] ?? $this->action_type;
    }

    public function getStatusLabelAttribute(): string
    {
        $labels = [
            'pending' => 'در انتظار',
            'in_progress' => 'در حال انجام',
            'completed' => 'تکمیل شده',
            'rejected' => 'رد شده',
            'skipped' => 'رد شده',
        ];
        return $labels[$this->status] ?? $this->status;
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'pending' 
            && $this->deadline 
            && $this->deadline < now();
    }

    // ─── Relationships ─────────────────────────────────────────

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function fromPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'from_position_id');
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'to_position_id');
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('to_user_id', $userId);
    }

    public function scopeForPosition($query, $positionId)
    {
        return $query->where('to_position_id', $positionId);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function complete($note = null): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completed_note' => $note,
        ]);
    }

    public function reject($note = null): void
    {
        $this->update([
            'status' => 'rejected',
            'completed_at' => now(),
            'completed_note' => $note,
        ]);
    }
}