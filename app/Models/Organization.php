<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organization extends Model
{
    use SoftDeletes;

    protected $table = 'organizations';


    protected $fillable = [
        'name',
        'code',
        'logo',
        'email',
        'phone',
        'address',
        'website',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function letterCategories(): HasMany
    {
        return $this->hasMany(LetterCategory::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExternal($query, $currentOrganizationId)
    {
        return $query->where('id', '!=', $currentOrganizationId)->where('status', 'active');
    }

    // ─── Helpers ───────────────────────────────────────────────

    public static function generateCode()
    {
        $prefix = 'ORG';
        $number = str_pad(self::count() + 1, 5, '0', STR_PAD_LEFT);
        return "$prefix-$number";
    }
}