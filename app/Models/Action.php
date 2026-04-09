<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Action extends Model
{
    use SoftDeletes;

    protected $table = 'actions';

    protected $fillable = [
        'routing_id',
        'user_id',
        'action_type',
        'description',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // ─── Accessors ─────────────────────────────────────────────

    public function getActionLabelAttribute(): string
    {
        $labels = [
            'view' => 'مشاهده',
            'download' => 'دانلود',
            'complete' => 'تکمیل',
            'reject' => 'رد',
            'forward' => 'ارجاع',
            'comment' => 'توضیح',
            'sign' => 'امضاء',
        ];
        return $labels[$this->action_type] ?? $this->action_type;
    }

    // ─── Relationships ─────────────────────────────────────────

    public function routing(): BelongsTo
    {
        return $this->belongsTo(Routing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}