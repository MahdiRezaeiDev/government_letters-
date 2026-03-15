<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'department_id', 'name', 'code', 'level',
        'is_management', 'description',
    ];

    protected $casts = [
        'is_management' => 'boolean',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function userPositions(): HasMany
    {
        return $this->hasMany(UserPosition::class);
    }

    /**
     * کاربران فعال این سمت
     */
    public function activeUsers()
    {
        return $this->hasManyThrough(
            User::class,
            UserPosition::class,
            'position_id',
            'id',
            'id',
            'user_id'
        )->where('user_positions.status', 'active');
    }

    /**
     * ارجاعات دریافتی این سمت
     */
    public function receivedRoutings(): HasMany
    {
        return $this->hasMany(Routing::class, 'to_position_id');
    }
}
