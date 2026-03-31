<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterFile extends Model
{
    protected $fillable = [
        'letter_id',
        'file_id'
    ];

    public function letter() : BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function file() : BelongsTo
    {
        return $this->belongsTo(File::class, 'file_id');
    }
}
