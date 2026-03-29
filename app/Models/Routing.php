<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class Routing extends Model
{
    protected $fillable = [
        'letter_id', 'from_position_id', 'from_user_id', 'to_position_id',
        'to_user_id', 'action_type', 'instruction', 'deadline', 'status',
        'completed_at', 'completed_note', 'priority', 'step_order',
        'is_parallel', 'parallel_group_id',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'completed_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
        'is_parallel' => 'boolean',
        'reminder_sent' => 'boolean',
    ];

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'to_position_id');
    }

    public function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }

    public function scopePendingForUser($query, int $userId)
    {
        return $query->where('to_user_id', $userId)
                     ->whereIn('status', ['pending', 'in_progress']);
    }

    public function isOverdue(): bool
    {
        return $this->deadline && $this->deadline->isPast()
               && !in_array($this->status, ['completed', 'rejected', 'skipped']);
    }
}