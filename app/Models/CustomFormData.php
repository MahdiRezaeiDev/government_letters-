<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomFormData extends Model
{
    protected $fillable = [
        'custom_form_id',
        'letter_id',
        'form_data',
        'submitted_by',
        'submitted_at',
    ];


    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }
}
