<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterHistory extends Model
{
    protected $table = 'letter_histories';

    protected $fillable = [
        'letter_id',
        'action_type',
        'field_name',
        'old_value',
        'new_value',
        'changes',
        'user_id',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    // ─── Relationships ─────────────────────────────────────────

    public function letter(): BelongsTo
    {
        return $this->belongsTo(Letter::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopeForLetter($query, $letterId)
    {
        return $query->where('letter_id', $letterId);
    }

    public function scopeOfType($query, $actionType)
    {
        return $query->where('action_type', $actionType);
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function getActionLabelAttribute(): string
    {
        $labels = [
            'created' => 'ایجاد',
            'updated' => 'ویرایش',
            'status_changed' => 'تغییر وضعیت',
            'routed' => 'ارجاع',
            'viewed' => 'مشاهده',
            'archived' => 'بایگانی',
            'delegated' => 'واگذاری',
        ];
        return $labels[$this->action_type] ?? $this->action_type;
    }
}