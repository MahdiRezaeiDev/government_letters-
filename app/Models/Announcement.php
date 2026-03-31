<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
   protected $fillable = [
       'organization_id',
       'title',
       'content',
       'priority',
       'target_type',
       'target_ids',
       'attachment_path',
       'expiry_date',
       'is_published',
       'created_by',
   ];


   public function organization() : BelongsTo
   {
       return $this->belongsTo(Organization::class);
   }

   public function Position () : BelongsTo
   {
        return $this->belongsTo(Position::class);
    }


    public $casts = [
        'target_ids' => 'array',
        'expiry_date' => 'datetime',
        'is_published' => 'boolean',
    ];
}
