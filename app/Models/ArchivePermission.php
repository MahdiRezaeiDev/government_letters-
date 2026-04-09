<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivePermission extends Model
{
    protected $table = 'archive_permissions';

    protected $fillable = [
        'archive_id',
        'position_id',
        'permission_type',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function archive(): BelongsTo
    {
        return $this->belongsTo(Archive::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeOfType($query, $permissionType)
    {
        return $query->where('permission_type', $permissionType);
    }
}