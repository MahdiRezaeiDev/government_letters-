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

    // همه زیرمجموعه‌های تودرتو
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    // محاسبه path هنگام ذخیره
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($department) {
            if ($department->parent_id) {
                $parent = Department::find($department->parent_id);
                $department->level = $parent->level + 1;
                $department->path = $parent->path . '/' . $parent->id;
            } else {
                $department->level = 0;
                $department->path = '';
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }
}