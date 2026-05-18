<?php
// app/Models/TazkiraAttachment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class TazkiraAttachment extends Model
{
    protected $table = 'tazkira_attachments';

    protected $fillable = [
        'tazkira_id',
        'file_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'description',
        'uploaded_by',
    ];

    protected $appends = [
        'file_url', // ← این خط را اضافه کنید
    ];

    public function tazkira()
    {
        return $this->belongsTo(Tazkira::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getFileUrlAttribute()
    {
        return Storage::url($this->file_path);
    }
}
