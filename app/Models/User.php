<?php

namespace App\Models;

use App\Casts\JalaliDateCast;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use Notifiable, SoftDeletes, HasRoles;

    protected $table = 'users';

    protected $fillable = [
        'organization_id',
        'department_id',
        'primary_position_id',
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'national_code',
        'mobile',
        'employment_code',
        'avatar',
        'gender',
        'birth_date',
        'emergency_phone',
        'address',
        'status',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'last_login_at',
        'last_login_ip',
        'last_activity_at',
        'email_verified_at',
        'security_clearance',
        'preferences',
        'locale',
        'timezone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'email_verified_at' => JalaliDateCast::class,
        'two_factor_confirmed_at' => 'datetime',
        'last_login_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'birth_date' => JalaliDateCast::class,
        'status' => 'string',
        'security_clearance' => 'string',
        'preferences' => 'array',
        'is_active' => 'boolean',
    ];

    // ─── Accessors ─────────────────────────────────────────────

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar
            ? asset('storage/' . $this->avatar)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->full_name) . '&background=random';
    }

    // ─── Relationships ─────────────────────────────────────────

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function primaryPosition(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'primary_position_id');
    }

    // app/Models/User.php
    public function positions()
    {
        return $this->belongsToMany(Position::class, 'user_positions')
            ->select('positions.id', 'positions.name', 'positions.code', 'positions.department_id')
            ->withPivot('is_primary', 'start_date', 'end_date', 'status')
            ->withTimestamps();
    }

    public function activePositions(): BelongsToMany
    {
        return $this->belongsToMany(Position::class, 'user_positions')
            ->wherePivot('status', 'active')
            ->where(function ($query) {
                $query->whereNull('user_positions.end_date')
                    ->orWhere('user_positions.end_date', '>=', now());
            });
    }

    public function createdLetters(): HasMany
    {
        return $this->hasMany(Letter::class, 'created_by');
    }

    public function routingsFrom(): HasMany
    {
        return $this->hasMany(Routing::class, 'from_user_id');
    }

    public function routingsTo(): HasMany
    {
        return $this->hasMany(Routing::class, 'to_user_id');
    }

    public function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }

    public function delegationsFrom(): HasMany
    {
        return $this->hasMany(Delegation::class, 'from_user_id');
    }

    public function delegationsTo(): HasMany
    {
        return $this->hasMany(Delegation::class, 'to_user_id');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    public function favoriteLetters(): HasMany
    {
        return $this->hasMany(FavoriteLetter::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function hasActivePosition(): bool
    {
        return $this->activePositions()->exists();
    }


    public function canManageOrganization(int $organizationId): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->isOrgAdmin() && $this->organization_id === $organizationId) {
            return true;
        }

        return false;
    }

    public function canAccessConfidential(): bool
    {
        return in_array($this->security_clearance, ['confidential', 'secret']);
    }

    public function updateLastActivity(): void
    {
        $this->update(['last_activity_at' => now()]);
    }

    // بررسی ادمین کل بودن
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    // بررسی ادمین سازمان بودن
    public function isOrgAdmin(): bool
    {
        return $this->hasRole('org-admin');
    }
    public function isDeptManager(): bool
    {
        return $this->hasRole('dep-admin');
    }

    // بررسی دسترسی به یک سازمان خاص
    public function belongsToOrganization(int $orgId): bool
    {
        return $this->isSuperAdmin() || $this->organization_id === $orgId;
    }

    public static function generateCode(): string
    {
        $lastUser = self::latest()->first();
        $lastCode = $lastUser ? (int) $lastUser->employment_code : 0;
        return str_pad($lastCode + 1, 6, '0', STR_PAD_LEFT);
    }
}
