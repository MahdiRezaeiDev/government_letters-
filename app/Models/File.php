<?php
// app/Models/File.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files'; // avoid conflict with PHP built-in

    protected $fillable = [
        'archive_id', 'name', 'code', 'description',
        'retention_period', 'retention_unit', 'expiry_date', 'is_active',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'is_active'   => 'boolean',
    ];

    public function archive()
    {
        return $this->belongsTo(Archive::class);
    }

    public function letters()
    {
        return $this->belongsToMany(Letter::class, 'letter_files');
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }
}