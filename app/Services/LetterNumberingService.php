<?php

namespace App\Services;

use App\Models\Letter;

class LetterNumberingService
{
    private array $prefixes = [
        'incoming' => 'IN',
        'outgoing' => 'OUT',
        'internal' => 'INT',
    ];

    public function generate(string $letterType, int $organizationId): string
    {
        $year   = $this->getCurrentYear();
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
        $year  = now()->year;
        $month = now()->month;
        $jalaliYear = $year - 621;
        if ($month <= 3) {
            $jalaliYear--;
        }
        return (string) $jalaliYear;
    }
}
