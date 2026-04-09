<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FavoriteLetter extends Model
{
    protected $table = 'favorite_letters';

    protected $fillable = [
        'user_id',
        'letter_id',
        'folder_name',
        'color',
        'note',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeInFolder($query, $folderName)
    {
        return $query->where('folder_name', $folderName);
    }
}