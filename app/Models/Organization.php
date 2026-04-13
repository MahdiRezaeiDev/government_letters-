<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organization extends Model
{
    use SoftDeletes;

    protected $table = 'organizations';

    protected $fillable = [
        'name',
        'code',
        'logo',
        'address',
        'phone',
        'email',
        'website',
        'parent_id',
        'status'
    ];

    protected $casts = [
        'status' => 'string',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Organization::class, 'parent_id');
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function letterCategories(): HasMany
    {
        return $this->hasMany(LetterCategory::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExternal($query, $currentOrganizationId)
    {
        return $query->where('id', '!=', $currentOrganizationId)->where('status', 'active');
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function getFullHierarchyAttribute(): string
    {
        $hierarchy = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($hierarchy, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $hierarchy);
    }
}