<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'letter_id',
        'user_id',
        'filename',
        'filepath',
        'file_size',
        'mime_type',
        'extension',
        'is_ocr_processed',
        'ocr_text',
        'download_count',
    ];
}
