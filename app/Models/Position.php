<?php
// app/Models/Position.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'department_id', 'name', 'code', 'level',
        'is_management', 'description',
    ];

    protected $casts = [
        'is_management' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_positions')
                    ->withPivot('is_primary', 'start_date', 'end_date', 'status');
    }

    public function activeUsers()
    {
        return $this->users()->wherePivot('status', 'active');
    }

    public function userPositions()
    {
        return $this->hasMany(UserPosition::class);
    }

    public function routingsReceived()
    {
        return $this->hasMany(Routing::class, 'to_position_id');
    }
}