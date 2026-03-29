<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class Department extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id', 'name', 'code', 'parent_id',
        'manager_position_id', 'status', 'level', 'path',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    // Recursive children for tree structure
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    protected static function booted(): void
    {
        static::creating(function (Department $dept) {
            if ($dept->parent_id) {
                $parent = static::find($dept->parent_id);
                $dept->level = $parent->level + 1;
                $dept->path = $parent->path . '/' . $parent->id;
            } else {
                $dept->level = 0;
                $dept->path = '';
            }
        });
    }
}