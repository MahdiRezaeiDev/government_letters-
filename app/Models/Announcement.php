<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use SoftDeletes;

    protected $table = 'announcements';

    protected $fillable = [
        'organization_id',
        'title',
        'content',
        'priority',
        'target_type',
        'target_ids',
        'attachment_path',
        'publish_date',
        'expiry_date',
        'is_published',
        'created_by',
    ];

    protected $casts = [
        'target_ids' => 'array',
        'publish_date' => 'datetime',
        'expiry_date' => 'datetime',
        'is_published' => 'boolean',
    ];

    // ─── Accessors ─────────────────────────────────────────────

    public function getPriorityLabelAttribute(): string
    {
        $labels = [
            'low' => 'کم',
            'normal' => 'عادی',
            'high' => 'مهم',
            'urgent' => 'فوری',
        ];
        return $labels[$this->priority] ?? $this->priority;
    }

    // ─── Relationships ─────────────────────────────────────────

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ─── Scopes ────────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where('publish_date', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                    ->orWhere('expiry_date', '>=', now());
            });
    }

    // ─── Helpers ───────────────────────────────────────────────

    public function isVisibleForUser(User $user): bool
    {
        if ($this->target_type === 'all') {
            return true;
        }

        if ($this->target_type === 'department') {
            return in_array($user->department_id, $this->target_ids ?? []);
        }

        if ($this->target_type === 'position') {
            $userPositionIds = $user->positions()->pluck('id')->toArray();
            return !empty(array_intersect($userPositionIds, $this->target_ids ?? []));
        }

        if ($this->target_type === 'user') {
            return in_array($user->id, $this->target_ids ?? []);
        }

        return false;
    }
}