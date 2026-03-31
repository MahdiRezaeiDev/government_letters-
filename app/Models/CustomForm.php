<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomForm extends Model
{
    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'description',
        'form_schema',
        'validation_rules',
        'is_active',
        'created_by',
    ]; 

    public function organization() : BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function position() : BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
}
