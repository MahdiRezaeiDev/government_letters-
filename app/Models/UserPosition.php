<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPosition extends Model
{
    protected $fillable = [
        'user_id', 'position_id', 'is_primary',
        'start_date', 'end_date', 'deputy_user_id', 'status',
    ];

    protected $casts = [
        'is_primary'  => 'boolean',
        'start_date'  => 'date',
        'end_date'    => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function deputyUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deputy_user_id');
    }
}
