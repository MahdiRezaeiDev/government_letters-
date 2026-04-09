<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DraftLetter extends Model
{
    protected $table = 'draft_letters';

    protected $fillable = [
        'letter_id',
        'title',
        'content',
        'summary',
        'version',
        'created_by',
        'locked_by',
        'locked_at',
        'is_active',
    ];

    protected $casts = [
        'content' => 'array',
        'locked_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lockedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'locked_by');
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function isLocked(): bool
    {
        return !is_null($this->locked_by) && !is_null($this->locked_at);
    }

    public function lock(User $user): void
    {
        $this->update([
            'locked_by' => $user->id,
            'locked_at' => now(),
        ]);
    }

    public function unlock(): void
    {
        $this->update([
            'locked_by' => null,
            'locked_at' => null,
        ]);
    }

    public function incrementVersion(): void
    {
        $this->increment('version');
    }
}