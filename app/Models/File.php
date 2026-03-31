<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'archive_id',
        'name',
        'code',
        'description',
        'retention_period',
        'expiry_date',
        'is_active',
    ];

    public function archive()
    {
        return $this->belongsTo(Archive::class);
    }
}
