<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany};

class User extends Authenticatable
{
    use Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'organization_id', 'username', 'email', 'password', 'first_name',
        'last_name', 'national_code', 'mobile', 'employment_code', 'avatar',
        'status', 'last_login_at', 'last_login_ip',
    ];

    protected $hidden = ['password', 'remember_token', 'two_factor_secret'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ─── Relationships ───────────────────────────────────────────
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function positions(): BelongsToMany
    {
        return $this->belongsToMany(Position::class, 'user_positions')
            ->withPivot(['is_primary', 'start_date', 'end_date', 'status'])
            ->withTimestamps();
    }

    public function primaryPosition()
    {
        return $this->positions()->wherePivot('is_primary', true)->first();
    }

    public function routings(): HasMany
    {
        return $this->hasMany(Routing::class, 'to_user_id');
    }

    // ─── Accessors ───────────────────────────────────────────────
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }
        return "https://ui-avatars.com/api/?name={$this->full_name}&background=random";
    }

    // ─── Helpers ─────────────────────────────────────────────────
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}