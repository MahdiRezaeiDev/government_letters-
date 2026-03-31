<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemSetting extends Model
{
    protected $fillable = [
        'organization_id',
        'group',
        'key',
        'value',
        'type',
    ];

    public function organization() : BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
