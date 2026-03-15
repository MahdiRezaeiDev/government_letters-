<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Keyword extends Model {
    protected $fillable = ['organization_id', 'name'];
    public function letters(): BelongsToMany { return $this->belongsToMany(Letter::class, 'letter_keywords'); }
}
