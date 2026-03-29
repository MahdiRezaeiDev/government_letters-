<?php
// app/Models/Attachment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'letter_id', 'user_id', 'file_name', 'file_path',
        'file_size', 'mime_type', 'extension', 'is_ocr_processed', 'ocr_text',
    ];

    protected $casts = [
        'is_ocr_processed' => 'boolean',
        'created_at'       => 'datetime',
    ];

    protected $appends = ['url', 'size_human'];

    public function letter()
    {
        return $this->belongsTo(Letter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }

    public function getSizeHumanAttribute(): string
    {
        $bytes = $this->file_size;
        if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
        if ($bytes >= 1024) return round($bytes / 1024, 2) . ' KB';
        return $bytes . ' B';
    }

    public function incrementDownload(): void
    {
        $this->increment('download_count');
    }
}