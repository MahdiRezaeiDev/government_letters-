<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LetterCategory extends Model
{

    protected $table = 'letter_categories';

    protected $fillable = [
        'organization_id',
        'name',
        'code',
        'parent_id',
        'description',
        'color',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];

    // ─── Accessors ─────────────────────────────────────────

    public function getStatusLabelAttribute(): string
    {
        return $this->status ? 'فعال' : 'غیرفعال';
    }

    public function getStatusColorAttribute(): string
    {
        return $this->status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
    }

    // ─── Relationships ─────────────────────────────────────────

    /**
     * رابطه با سازمان
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * رابطه با دسته‌بندی والد
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(LetterCategory::class, 'parent_id');
    }

    /**
     * رابطه با زیردسته‌ها
     */
    public function children(): HasMany
    {
        return $this->hasMany(LetterCategory::class, 'parent_id');
    }

    /**
     * رابطه با نامه‌ها
     */
    public function letters(): HasMany
    {
        return $this->hasMany(Letter::class, 'category_id');
    }

    // ─── Scopes ─────────────────────────────────────────

    /**
     * Scope برای دسته‌بندی‌های فعال
     */
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    /**
     * Scope برای دسته‌بندی‌های یک سازمان
     */
    public function scopeForOrganization($query, int $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    /**
     * Scope برای دسته‌بندی‌های سطح بالا (بدون والد)
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope مرتب‌سازی بر اساس sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc');
    }

    // ─── Helpers ─────────────────────────────────────────

    /**
     * دریافت مسیر کامل دسته‌بندی (برای نمایش درختی)
     */
    public function getFullPathAttribute(): string
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $path);
    }

    /**
     * دریافت سطح دسته‌بندی (عمق درخت)
     */
    public function getLevelAttribute(): int
    {
        $level = 0;
        $parent = $this->parent;

        while ($parent) {
            $level++;
            $parent = $parent->parent;
        }

        return $level;
    }

    /**
     * بررسی اینکه دسته‌بندی دارای زیردسته است
     */
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    /**
     * بررسی اینکه دسته‌بندی قابل حذف است
     */
    public function isDeletable(): bool
    {
        return !$this->hasChildren() && $this->letters()->count() === 0;
    }

    /**
     * دریافت همه زیردسته‌ها به صورت بازگشتی
     */
    public function getAllDescendants(): array
    {
        $descendants = [];
        
        foreach ($this->children as $child) {
            $descendants[] = $child;
            $descendants = array_merge($descendants, $child->getAllDescendants());
        }
        
        return $descendants;
    }

    public static function generateCode() {
        $lastCategory = self::orderBy('id', 'desc')->first();
        $lastCode = $lastCategory ? (int) $lastCategory->code : 0;
        return str_pad($lastCode + 1, 4, '0', STR_PAD_LEFT);
    }
}