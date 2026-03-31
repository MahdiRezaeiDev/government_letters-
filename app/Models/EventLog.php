<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventLog extends Model
{
    protected $fillable = [
        'user_id',
        'event_type',
        'subject_type',
        'subject_id',
        'description',
        'ip_address',
        'user_agent',
    ];


    public function position() : BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    
}
