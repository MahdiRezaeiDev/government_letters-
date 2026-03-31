<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LetterCategory extends Model
{
    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'parent_id',
        'description',
        'color',
        'sort_order',
        'status',
    ];

    

}
