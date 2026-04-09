<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CaseModel extends Model
{
    use SoftDeletes;

    protected $table = 'cases';

    protected $fillable = [
        'archive_id',
        'title',
        'case_number',
        'description',
        'retention_period',
        'retention_unit',
        'expiry_date',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'is_active' => 'boolean',
        'retention_period' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function archive(): BelongsTo
    {
        return $this->belongsTo(Archive::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function letters(): BelongsToMany
    {
        return $this->belongsToMany(Letter::class, 'case_letters')
            ->withPivot('archived_at', 'archived_by')
            ->withTimestamps();
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date < now();
    }

    public function getRetentionLabelAttribute(): string
    {
        if (!$this->retention_period) {
            return 'دائمی';
        }

        $units = [
            'days' => 'روز',
            'months' => 'ماه',
            'years' => 'سال',
        ];

        return $this->retention_period . ' ' . ($units[$this->retention_unit] ?? '');
    }
}