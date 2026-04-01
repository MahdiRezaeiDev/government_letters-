<?php

namespace App\Models;

use Database\Factories\OrganizationFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organization extends Model
{
     /** @use HasFactory<OrganizationFactory> */
    use HasFactory, SoftDeletes, HasFactory;

    protected $fillable = [
        'name', 'code', 'logo', 'address',
        'phone', 'email', 'website', 'parent_id', 'status',
    ];

    // رابطه با سازمان والد
    public function parent()
    {
        return $this->belongsTo(Organization::class, 'parent_id');
    }

    // رابطه با زیرمجموعه‌ها
    public function children()
    {
        return $this->hasMany(Organization::class, 'parent_id');
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}