<?php
// app/Models/SystemSetting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    protected $fillable = ['organization_id', 'group', 'key', 'value', 'type'];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    // Static helper
    public static function getValue(int $orgId, string $group, string $key, mixed $default = null): mixed
    {
        $cacheKey = "setting_{$orgId}_{$group}_{$key}";

        return Cache::remember($cacheKey, 3600, function () use ($orgId, $group, $key, $default) {
            $setting = self::where('organization_id', $orgId)
                          ->where('group', $group)
                          ->where('key', $key)
                          ->first();

            if (!$setting) return $default;

            return match ($setting->type) {
                'boolean' => (bool) $setting->value,
                'number'  => (float) $setting->value,
                'json'    => json_decode($setting->value, true),
                default   => $setting->value,
            };
        });
    }

    public static function setValue(int $orgId, string $group, string $key, mixed $value, string $type = 'text'): void
    {
        $strValue = is_array($value) ? json_encode($value) : (string) $value;

        self::updateOrCreate(
            ['organization_id' => $orgId, 'group' => $group, 'key' => $key],
            ['value' => $strValue, 'type' => $type]
        );

        // Clear cache
        Cache::forget("setting_{$orgId}_{$group}_{$key}");
    }
}