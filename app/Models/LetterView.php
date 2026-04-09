<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterView extends Model
{
    protected $table = 'letter_views';

    protected $fillable = [
        'letter_id',
        'user_id',
        'viewed_at',
        'ip_address',
        'user_agent',
        'duration',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
        'duration' => 'integer',
    ];

    public $timestamps = false;

    // ─── Relationships ─────────────────────────────────────────

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeForLetter($query, $letterId)
    {
        return $query->where('letter_id', $letterId);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}