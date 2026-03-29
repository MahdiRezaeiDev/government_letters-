<?php
// app/Models/EventLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'event_type', 'subject_type', 'subject_id',
        'description', 'properties', 'ip_address', 'user_agent',
    ];

    protected $casts = [
        'properties' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subject()
    {
        return $this->morphTo();
    }

    // Static helper for easy logging
    public static function log(
        string $eventType,
        string $description,
        ?Model $subject = null,
        array $properties = []
    ): self {
        return self::create([
            'user_id'      => auth()->id(),
            'event_type'   => $eventType,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id'   => $subject?->id,
            'description'  => $description,
            'properties'   => $properties,
            'ip_address'   => request()->ip(),
            'user_agent'   => request()->userAgent(),
        ]);
    }
}