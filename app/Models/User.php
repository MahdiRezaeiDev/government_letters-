<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name', 'email', 'password', 'organization_id', 'username', 'first_name', 'last_name',
        'national_code', 'mobile', 'employment_code', 'avatar', 'status',
        'last_login_at', 'last_login_ip',
    ];

    protected $hidden = [
        'password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

        // و این relationها رو اضافه کن:
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function positions()
    {
        return $this->belongsToMany(Position::class, 'user_positions')
                    ->withPivot('is_primary', 'start_date', 'end_date', 'status')
                    ->withTimestamps();
    }

    public function primaryPosition()
    {
        return $this->positions()->wherePivot('is_primary', true)->first();
    }

    public function routings()
    {
        return $this->hasMany(Routing::class, 'to_user_id');
    }
}
