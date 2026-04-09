<?php
// app/Models/ArchiveCase.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ArchiveCase extends Model
{
    use SoftDeletes;

    protected $table = 'archive_cases';  // ← نام جدول جدید

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
        return $this->belongsToMany(Letter::class, 'case_letters', 'archive_case_id', 'letter_id')
                    ->withPivot('archived_at', 'archived_by')
                    ->withTimestamps();
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date < now();
    }
}