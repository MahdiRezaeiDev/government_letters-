<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemSetting extends Model
{
    protected $table = 'system_settings';

    protected $fillable = [
        'organization_id',
        'group',
        'key',
        'value',
        'type',
    ];

    protected $casts = [
        'value' => 'string',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeGroup($query, $group)
    {
        return $query->where('group', $group);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function getTypedValueAttribute()
    {
        return match ($this->type) {
            'number' => (float) $this->value,
            'boolean' => (bool) $this->value,
            'json' => json_decode($this->value, true),
            default => $this->value,
        };
    }

    public static function getValue($key, $default = null, $organizationId = null)
    {
        $query = static::where('key', $key);
        
        if ($organizationId) {
            $query->where('organization_id', $organizationId);
        } else {
            $query->whereNull('organization_id');
        }
        
        $setting = $query->first();
        
        return $setting ? $setting->typed_value : $default;
    }
}