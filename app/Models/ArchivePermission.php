<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivePermission extends Model
{
    protected $fillable = [
        'archive_id',
        'position_id',
        'permission_type',
    ];

    public function archive() : BelongsTo
    {
        return $this->belongsTo(Archive::class);
    }

    public function position() : BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
}
