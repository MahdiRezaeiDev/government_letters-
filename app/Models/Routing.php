<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Routing extends Model
{
    protected $fillable = [
        'letter_id', 'from_position_id', 'from_user_id',
        'to_position_id', 'to_user_id', 'action_type', 'instruction',
        'deadline', 'reminder_sent', 'reminder_sent_at', 'status',
        'completed_at', 'completed_note', 'priority', 'step_order',
        'is_parallel', 'parallel_group_id',
    ];

    protected $casts = [
        'deadline'         => 'datetime',
        'reminder_sent_at' => 'datetime',
        'completed_at'     => 'datetime',
        'reminder_sent'    => 'boolean',
        'is_parallel'      => 'boolean',
    ];

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function fromPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'from_position_id');
    }

    public function toPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'to_position_id');
    }

    public function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }

    public function getActionTypeLabel(): string
    {
        return match($this->action_type) {
            'action'       => 'اقدام',
            'information'  => 'جهت اطلاع',
            'approval'     => 'تأیید',
            'coordination' => 'هماهنگی',
            'sign'         => 'امضاء',
            default        => $this->action_type,
        };
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isOverdue(): bool
    {
        return $this->deadline && $this->deadline->isPast() && $this->isPending();
    }
}
