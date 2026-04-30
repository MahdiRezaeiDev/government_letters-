<?php

namespace App\Enums;

enum PriorityLevelEnum: string
{
    case LOW = 'low';
    case NORMAL = 'normal';
    case HIGH = 'high';
    case URGENT = 'urgent';
    case VERY_URGENT = 'very_urgent';

    public function label(): string
    {
        return match ($this) {
            self::LOW => 'عادی',
            self::NORMAL => 'معمولی',
            self::HIGH => 'مهم',
            self::URGENT => 'فوری',
            self::VERY_URGENT => 'فوق‌العاده',
        };
    }

    public function activeColor(): string
    {
        return match ($this) {
            self::LOW => 'border-slate-500 bg-slate-100 text-slate-800',
            self::NORMAL => 'border-blue-500 bg-blue-100 text-blue-800',
            self::HIGH => 'border-yellow-500 bg-yellow-100 text-yellow-800',
            self::URGENT => 'border-orange-500 bg-orange-100 text-orange-800',
            self::VERY_URGENT => 'border-red-500 bg-red-100 text-red-800',
        };
    }

    public function inactiveColor(): string
    {
        return match ($this) {
            self::LOW => 'border-slate-300 text-slate-600 hover:bg-slate-50',
            self::NORMAL => 'border-blue-300 text-blue-600 hover:bg-blue-50',
            self::HIGH => 'border-yellow-300 text-yellow-600 hover:bg-yellow-50',
            self::URGENT => 'border-orange-300 text-orange-600 hover:bg-orange-50',
            self::VERY_URGENT => 'border-red-300 text-red-600 hover:bg-red-50',
        };
    }
}
