<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
     /** @use HasFactory<DepartmentFactory> */
    use SoftDeletes, HasFactory;

     protected $table = 'departments';

     protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $fillable = [
        'organization_id', 'name', 'code',
        'parent_id', 'manager_position_id', 'status', 'level', 'path',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function parent()
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    // همه زیرمجموعه‌ها به صورت بازگشتی
    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }
}