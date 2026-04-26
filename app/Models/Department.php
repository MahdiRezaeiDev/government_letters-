<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Department extends Model
{
    use SoftDeletes;

    protected $table = 'departments';

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'parent_id',
        'manager_position_id',
        'status',
        'level',
        'path'
    ];

    protected $casts = [
        'status' => 'string',
        'level' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────────────────

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

    public function managerPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'manager_position_id');
    }

    public function archives(): HasMany
    {
        return $this->hasMany(Archive::class);
    }

    // Department.php
    public function users(): HasMany {
        return $this->hasMany(User::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function getFullPathAttribute(): string
    {
        if (!$this->path) {
            return $this->name;
        }

        $parentNames = collect(explode('/', $this->path))
            ->map(function ($id) {
                $dept = Department::find($id);
                return $dept ? $dept->name : null;
            })
            ->filter()
            ->implode(' > ');

        return $parentNames ? $parentNames . ' > ' . $this->name : $this->name;
    }

    public static function generateCode(): string
    {
        $latest = self::latest('id')->first();
        $number = $latest ? intval(substr($latest->code, 3)) + 1 : 1;
        return 'DEP' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}