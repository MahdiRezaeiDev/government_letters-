<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Routing extends Model
{
    protected $fillable = [
        'letter_id', 'from_position_id', 'from_user_id',
        'to_position_id', 'to_user_id', 'action_type',
        'instruction', 'deadline', 'status', 'completed_at',
        'completed_note', 'priority', 'step_order',
        'is_parallel', 'parallel_group_id',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'completed_at' => 'datetime',
        'is_parallel' => 'boolean',
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
}