<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Action extends Model
{
    protected $fillable = [
        'routing_id', 'user_id', 'action_type',
        'description', 'metadata', 'ip_address', 'user_agent',
    ];

    protected $casts = ['metadata' => 'array'];

    public function routing(): BelongsTo { return $this->belongsTo(Routing::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
