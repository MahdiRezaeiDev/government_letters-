<?php
// app/Models/Archive.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    protected $fillable = ['organization_id', 'name', 'code', 'parent_id', 'description', 'location', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function parent()
    {
        return $this->belongsTo(Archive::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Archive::class, 'parent_id');
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function permissions()
    {
        return $this->hasMany(ArchivePermission::class);
    }
}