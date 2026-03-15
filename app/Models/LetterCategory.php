<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class LetterCategory extends Model
{
    protected $fillable = [
        'organization_id', 'name', 'code', 'parent_id',
        'description', 'color', 'sort_order', 'status',
    ];

    protected $casts = ['status' => 'boolean'];

    public function organization(): BelongsTo { return $this->belongsTo(Organization::class); }
    public function parent(): BelongsTo { return $this->belongsTo(LetterCategory::class, 'parent_id'); }
    public function children(): HasMany { return $this->hasMany(LetterCategory::class, 'parent_id'); }
    public function letters(): HasMany { return $this->hasMany(Letter::class, 'category_id'); }
}
