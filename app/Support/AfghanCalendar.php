<?php

namespace App\Support;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Morilog\Jalali\Jalalian;

class AfghanCalendar
{
    public const MONTHS = [
        1  => 'حمل',
        2  => 'ثور',
        3  => 'جوزا',
        4  => 'سرطان',
        5  => 'اسد',
        6  => 'سنبله',
        7  => 'میزان',
        8  => 'عقرب',
        9  => 'قوس',
        10 => 'جدی',
        11 => 'دلو',
        12 => 'حوت',
    ];

    public static function monthName(int $month): string
    {
        return self::MONTHS[$month] ?? (string) $month;
    }

    public static function labelFromCarbon(Carbon|CarbonImmutable $date, bool $includeYear = true, bool $shortYear = false): string
    {
        $jalali = Jalalian::fromCarbon($date instanceof Carbon ? $date : $date->toMutable());
        $name   = self::monthName($jalali->getMonth());

        if (! $includeYear) {
            return $name;
        }

        $year = $shortYear
            ? substr((string) $jalali->getYear(), -2)
            : $jalali->getYear();

        return "{$name} {$year}";
    }

    /**
     * تبدیل کلید ماه میلادی (مثلاً 2026-07) به برچسب شمسی افغانی
     */
    public static function labelFromGregorianMonthKey(string $yearMonth, bool $shortYear = false): string
    {
        try {
            $carbon = Carbon::createFromFormat('Y-m', $yearMonth)->startOfMonth();

            return self::labelFromCarbon($carbon, true, $shortYear);
        } catch (\Exception $e) {
            return $yearMonth;
        }
    }

    public static function allMonthNames(): array
    {
        return array_values(self::MONTHS);
    }
}
