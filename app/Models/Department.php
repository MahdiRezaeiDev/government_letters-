<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id', 'name', 'code', 'parent_id',
        'manager_position_id', 'status', 'level', 'path',
    ];

    /**
     * سازمان مربوطه
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * واحد سازمانی والد
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    /**
     * واحدهای زیرمجموعه
     */
    public function children(): HasMany
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    /**
     * تمام زیرمجموعه‌ها (بازگشتی)
     */
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    /**
     * سمت‌های این واحد
     */
    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    /**
     * به‌روزرسانی مسیر درختی
     */
    public function updatePath(): void
    {
        if ($this->parent_id) {
            $parent = $this->parent;
            $this->path = ($parent->path ? $parent->path . '.' : '') . $this->id;
            $this->level = $parent->level + 1;
        } else {
            $this->path = (string) $this->id;
            $this->level = 0;
        }
        $this->saveQuietly();
    }
}
