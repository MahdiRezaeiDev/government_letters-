<?php

namespace App\Enums;

enum SecurityLevelEnum: string
{
    case PUBLIC = 'public';
    case INTERNAL = 'internal';
    case CONFIDENTIAL = 'confidential';
    case SECRET = 'secret';

    public function label(): string
    {
        return match ($this) {
            self::PUBLIC => 'عمومی',
            self::INTERNAL => 'داخلی',
            self::CONFIDENTIAL => 'محرمانه',
            self::SECRET => 'سری',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PUBLIC => 'bg-slate-100 text-slate-700 border-slate-500',
            self::INTERNAL => 'bg-blue-100 text-blue-700 border-blue-500',
            self::CONFIDENTIAL => 'bg-yellow-100 text-yellow-700 border-yellow-500',
            self::SECRET => 'bg-purple-100 text-purple-700 border-purple-500',
        };
    }

    public function activeColor(): string
    {
        return match ($this) {
            self::PUBLIC => 'border-slate-500 bg-slate-100 text-slate-800',
            self::INTERNAL => 'border-blue-500 bg-blue-100 text-blue-800',
            self::CONFIDENTIAL => 'border-yellow-500 bg-yellow-100 text-yellow-800',
            self::SECRET => 'border-purple-500 bg-purple-100 text-purple-800',
        };
    }

    public function inactiveColor(): string
    {
        return match ($this) {
            self::PUBLIC => 'border-slate-300 text-slate-600 hover:bg-slate-50',
            self::INTERNAL => 'border-blue-300 text-blue-600 hover:bg-blue-50',
            self::CONFIDENTIAL => 'border-yellow-300 text-yellow-600 hover:bg-yellow-50',
            self::SECRET => 'border-purple-300 text-purple-600 hover:bg-purple-50',
        };
    }
}
