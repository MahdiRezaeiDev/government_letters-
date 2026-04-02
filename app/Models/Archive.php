<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Archive extends Model
{
    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'parent_id',
        'description',
        'is_active',
    ];

    public function organization() : BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function parent() : BelongsTo
    {
        return $this->belongsTo(Archive::class, 'parent_id');
    }

    public function children() : HasMany
    {
        return $this->hasMany(Archive::class, 'parent_id');
    }

    public function files() : HasMany
    {
        return $this->hasMany(File::class);
    }
}
