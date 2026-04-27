<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Position extends Model
{
    use SoftDeletes;

    protected $table = 'positions';

    protected $fillable = [
        'department_id',
        'name',
        'code',
        'level',
        'is_management',
        'description'
    ];

    protected $casts = [
        'is_management' => 'boolean',
        'level' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function userPositions(): HasMany
    {
        return $this->hasMany(UserPosition::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_positions')
            ->withPivot('is_primary', 'start_date', 'end_date', 'status')
            ->withTimestamps();
    }

    public function activeUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_positions')
            ->wherePivot('status', 'active')
            ->where(function ($query) {
                $query->whereNull('user_positions.end_date')
                    ->orWhere('user_positions.end_date', '>=', now());
            });
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeManagement($query)
    {
        return $query->where('is_management', true);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function getFullTitleAttribute(): string
    {
        return $this->department->name . ' - ' . $this->name;
    }

    public static function generateCode(): string
    {
        $latest = self::latest('id')->first();
        $number = $latest ? intval(substr($latest->code, 3)) + 1 : 1;
        return 'POS' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
