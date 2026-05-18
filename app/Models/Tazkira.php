<?php
// app/Models/Tazkira.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Tazkira extends Model
{
    use SoftDeletes;

    protected $table = 'tazkiras';

    protected $fillable = [
        'first_name',
        'last_name',
        'father_name',
        'grandfather_name',
        'tazkira_number',
        'volume',
        'page',
        'registration_number',
        'birth_date',
        'birth_place',
        'national_code',
        'father_card_number',
        'phone',
        'mobile',
        'address',
        'email',
        'tazkira_image',
        'status',
        'notes',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'approved_at' => 'datetime',
    ];

    // ==================== روابط ====================

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function attachments()
    {
        return $this->hasMany(TazkiraAttachment::class);
    }

    public function reviewLogs()
    {
        return $this->hasMany(TazkiraReviewLog::class)->orderBy('reviewed_at', 'desc');
    }

    public function latestReviewLog()
    {
        return $this->hasOne(TazkiraReviewLog::class)->latest('reviewed_at');
    }

    // ==================== اسکوپ‌ها ====================

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // ==================== متدهای کمکی ====================

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function getTazkiraImageUrlAttribute(): ?string
    {
        if ($this->tazkira_image) {
            return Storage::url($this->tazkira_image);
        }
        return null;
    }
}
