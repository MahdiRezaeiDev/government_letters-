<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LetterKeyword extends Model
{
    protected $fillable = [
        'letter_id',
        'keyword_id',
    ];

    public function letter(): HasMany
    {
        return $this->hasMany(Letter::class);
    }

    public function keyword(): HasMany
    {
        return $this->hasMany(Keyword::class);
    }
}
