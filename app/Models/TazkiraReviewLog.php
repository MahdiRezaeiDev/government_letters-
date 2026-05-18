<?php
// app/Models/TazkiraReviewLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TazkiraReviewLog extends Model
{
    protected $table = 'tazkira_review_logs';

    protected $fillable = [
        'tazkira_id',
        'action',
        'note',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function tazkira()
    {
        return $this->belongsTo(Tazkira::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function attachments()
    {
        return $this->hasMany(TazkiraReviewAttachment::class, 'review_log_id');
    }
}
