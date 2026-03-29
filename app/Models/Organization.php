<?php
// app/Models/Organization.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code', 'logo', 'address', 'phone',
        'email', 'website', 'parent_id', 'status',
    ];

    public function parent()
    {
        return $this->belongsTo(Organization::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Organization::class, 'parent_id');
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function letters()
    {
        return $this->hasMany(Letter::class);
    }

    public function settings()
    {
        return $this->hasMany(SystemSetting::class);
    }

    // Get setting value
    public function getSetting(string $group, string $key, mixed $default = null): mixed
    {
        $setting = $this->settings()
                        ->where('group', $group)
                        ->where('key', $key)
                        ->first();

        return $setting ? $this->castSettingValue($setting) : $default;
    }

    private function castSettingValue(SystemSetting $setting): mixed
    {
        return match ($setting->type) {
            'boolean' => (bool) $setting->value,
            'number'  => (float) $setting->value,
            'json'    => json_decode($setting->value, true),
            default   => $setting->value,
        };
    }
}