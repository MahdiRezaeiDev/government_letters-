<?php
namespace App\Services;

use App\Models\Letter;

class LetterNumberingService
{
    // پیشوند هر نوع نامه
    private array $prefixes = [
        'incoming' => 'و',
        'outgoing' => 'ص',
        'internal' => 'د',
    ];

    public function generate(string $letterType, int $organizationId): string
    {
        $year  = $this->getCurrentYear();
        $prefix = $this->prefixes[$letterType];

        $last = Letter::where('organization_id', $organizationId)
            ->where('letter_type', $letterType)
            ->whereYear('created_at', now()->year)
            ->whereNotNull('letter_number')
            ->lockForUpdate()
            ->count();

        $sequence = str_pad($last + 1, 5, '0', STR_PAD_LEFT);

        return "{$prefix}/{$year}/{$sequence}";
    }

    private function getCurrentYear(): string
    {
        // سال شمسی
        return $this->toJalaliYear(now()->year, now()->month);
    }

    private function toJalaliYear(int $gregorianYear, int $month): string
    {
        // تبدیل ساده سال میلادی به شمسی
        $jalaliYear = $gregorianYear - 621;
        if ($month <= 3) {
            $jalaliYear--;
        }
        return (string) $jalaliYear;
    }
}