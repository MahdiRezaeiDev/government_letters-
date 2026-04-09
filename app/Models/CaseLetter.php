<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseLetter extends Model
{
    protected $table = 'case_letters';

    protected $fillable = [
        'case_id',
        'letter_id',
        'archived_at',
        'archived_by',
    ];

    protected $casts = [
        'archived_at' => 'datetime',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function case(): BelongsTo
    {
        return $this->belongsTo(CaseModel::class);
    }

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function archivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'archived_by');
    }
}