<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles;

    /**
     * فیلدهایی که قابل mass assignment هستند
     */
    protected $fillable = [
        'organization_id',
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'national_code',
        'mobile',
        'employment_code',
        'avatar',
        'status',
        'last_login_at',
        'last_login_ip',
    ];

    /**
     * فیلدهای مخفی در JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Cast انواع داده
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'        => 'datetime',
            'last_login_at'            => 'datetime',
            'two_factor_confirmed_at'  => 'datetime',
            'password'                 => 'hashed',
        ];
    }

    /**
     * نام کامل کاربر
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * سازمان کاربر
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * سمت‌های کاربر
     */
    public function userPositions(): HasMany
    {
        return $this->hasMany(UserPosition::class);
    }

    /**
     * سمت اصلی فعال کاربر
     */
    public function primaryPosition()
    {
        return $this->hasOneThrough(
            Position::class,
            UserPosition::class,
            'user_id',
            'id',
            'id',
            'position_id'
        )->where('user_positions.is_primary', true)
         ->where('user_positions.status', 'active');
    }

    /**
     * ارجاعاتی که برای کاربر ارسال شده
     */
    public function receivedRoutings(): HasMany
    {
        return $this->hasMany(Routing::class, 'to_user_id');
    }

    /**
     * ارجاعاتی که کاربر ارسال کرده
     */
    public function sentRoutings(): HasMany
    {
        return $this->hasMany(Routing::class, 'from_user_id');
    }

    /**
     * نامه‌های ایجاد شده توسط کاربر
     */
    public function createdLetters(): HasMany
    {
        return $this->hasMany(Letter::class, 'created_by');
    }

    /**
     * آیا کاربر فعال است؟
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * آواتار پیش‌فرض
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }

        // آواتار پیش‌فرض بر اساس حروف اول نام
        return "https://ui-avatars.com/api/?name=" . urlencode($this->full_name) . "&background=3B82F6&color=fff";
    }
}
