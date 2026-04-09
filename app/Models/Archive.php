<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Archive extends Model
{
    use SoftDeletes;

    protected $table = 'archives';

    protected $fillable = [
        'department_id',
        'name',
        'code',
        'parent_id',
        'description',
        'location',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Archive::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Archive::class, 'parent_id');
    }

    public function cases(): HasMany
    {
        return $this->hasMany(CaseModel::class);
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(ArchivePermission::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }
}