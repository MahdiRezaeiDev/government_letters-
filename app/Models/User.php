<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'organization_id', 'username', 'email', 'password',
        'first_name', 'last_name', 'national_code', 'mobile',
        'employment_code', 'avatar', 'status',
    ];

    protected $hidden = [
        'password', 'remember_token',
        'two_factor_secret', 'two_factor_recovery_codes',
    ];

    protected $casts = [
        'email_verified_at'        => 'datetime',
        'two_factor_confirmed_at'  => 'datetime',
        'last_login_at'            => 'datetime',
        'password'                 => 'hashed',
    ];

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // ارتباطات
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function userPositions(): HasMany
    {
        return $this->hasMany(UserPosition::class);
    }

    public function primaryPosition()
    {
        return $this->userPositions()
            ->where('is_primary', true)
            ->where('status', 'active')
            ->with('position.department')
            ->first();
    }

    public function activePositions()
    {
        return $this->userPositions()
            ->where('status', 'active')
            ->whereNull('end_date')
            ->orWhere('end_date', '>=', now())
            ->with('position');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOfOrganization($query, int $orgId)
    {
        return $query->where('organization_id', $orgId);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}