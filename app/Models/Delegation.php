<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delegation extends Model
{
    protected $table = 'delegations';

    protected $fillable = [
        'from_user_id',
        'to_user_id',
        'delegation_type',
        'letter_ids',
        'action_types',
        'start_date',
        'end_date',
        'status',
        'reason',
        'created_by',
    ];

    protected $casts = [
        'letter_ids' => 'array',
        'action_types' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function isActive(): bool
    {
        return $this->status === 'active'
            && $this->start_date <= now()
            && $this->end_date >= now();
    }

    public function coversLetter(Letter $letter): bool
    {
        if ($this->delegation_type === 'all') {
            return true;
        }

        if ($this->delegation_type === 'specific_letters' && $this->letter_ids) {
            return in_array($letter->id, $this->letter_ids);
        }

        return false;
    }
}