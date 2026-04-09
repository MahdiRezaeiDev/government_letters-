<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    protected $table = 'reminders';

    protected $fillable = [
        'letter_id',
        'routing_id',
        'user_id',
        'reminder_type',
        'reminder_date',
        'message',
        'is_sent',
        'sent_at',
        'status',
        'created_by',
    ];

    protected $casts = [
        'reminder_date' => 'datetime',
        'sent_at' => 'datetime',
        'is_sent' => 'boolean',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function routing(): BelongsTo
    {
        return $this->belongsTo(Routing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', 'pending')
            ->where('reminder_date', '<=', now());
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function markAsSent(): void
    {
        $this->update([
            'is_sent' => true,
            'sent_at' => now(),
            'status' => 'sent',
        ]);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}