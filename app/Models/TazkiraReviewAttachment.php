<?php
// app/Models/TazkiraReviewAttachment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class TazkiraReviewAttachment extends Model
{
    protected $table = 'tazkira_review_attachments';

    protected $fillable = [
        'review_log_id',
        'file_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'uploaded_by',
    ];

    protected $appends = ['file_url']; // ← اضافه شد

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? Storage::url($this->file_path) : null;
    }

    public function reviewLog()
    {
        return $this->belongsTo(TazkiraReviewLog::class, 'review_log_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
