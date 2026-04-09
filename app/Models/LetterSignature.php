<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterSignature extends Model
{
    protected $table = 'letter_signatures';

    protected $fillable = [
        'letter_id',
        'user_id',
        'signature_type',
        'signature_data',
        'certificate_id',
        'signed_at',
        'verified_at',
        'verified_by',
        'verification_result',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'verified_at' => 'datetime',
        'verification_result' => 'boolean',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeVerified($query)
    {
        return $query->where('verification_result', true);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function verify(): void
    {
        // منطق بررسی امضای دیجیتال
        $this->update([
            'verified_at' => now(),
            'verification_result' => true,
        ]);
    }
}