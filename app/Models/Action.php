<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    protected $fillable = [
        'routing_id',
        'user_id',
        'action_type',
        'description',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function routing()
    {
        return $this->belongsTo(Routing::class);
    }
    
}
