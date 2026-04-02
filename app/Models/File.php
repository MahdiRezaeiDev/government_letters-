<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    protected $fillable = [
        'archive_id',
        'name',
        'code',
        'description',
        'retention_period',
        'expiry_date',
        'is_active',
        'letter_id',
    ];

    public function archive()
    {
        return $this->belongsTo(Archive::class);
    }

    public function letter (): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }
}
