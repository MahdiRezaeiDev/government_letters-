<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
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

    public function letter()
    {
        return $this->belongsTo(Letter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}
