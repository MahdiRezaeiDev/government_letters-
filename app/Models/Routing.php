<?php
// app/Models/Routing.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Routing extends Model
{
    use HasFactory;

    protected $fillable = [
        'letter_id', 'from_position_id', 'from_user_id', 'to_position_id', 'to_user_id',
        'action_type', 'instruction', 'deadline', 'status', 'completed_at',
        'completed_note', 'priority', 'step_order', 'is_parallel', 'parallel_group_id',
    ];

    protected $casts = [
        'deadline'     => 'datetime',
        'completed_at' => 'datetime',
        'is_parallel'  => 'boolean',
    ];

    public function letter()
    {
        return $this->belongsTo(Letter::class);
    }

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function fromPosition()
    {
        return $this->belongsTo(Position::class, 'from_position_id');
    }

    public function toPosition()
    {
        return $this->belongsTo(Position::class, 'to_position_id');
    }

    public function actions()
    {
        return $this->hasMany(Action::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('to_user_id', $userId);
    }

    public function isOverdue(): bool
    {
        return $this->deadline && $this->deadline->isPast() && $this->status === 'pending';
    }

    public function complete(string $note = null): void
    {
        $this->update([
            'status'       => 'completed',
            'completed_at' => now(),
            'completed_note'=> $note,
        ]);
    }

    public function reject(string $note = null): void
    {
        $this->update([
            'status'        => 'rejected',
            'completed_at'  => now(),
            'completed_note'=> $note,
        ]);
    }
}