<?php

namespace App\Services;

use App\Models\Letter;
use Illuminate\Support\Facades\DB;

class LetterNumberingService
{
    /**
     * تولید شماره نامه منحصر به فرد
     */
    public function generate(string $type, int $organizationId): string
    {
        return DB::transaction(function () use ($type, $organizationId) {
            $year  = now()->format('Y');
            $month = now()->format('m');

            // قفل برای جلوگیری از race condition
            $count = Letter::where('organization_id', $organizationId)
                ->where('letter_type', $type)
                ->whereYear('created_at', $year)
                ->lockForUpdate()
                ->count();

            $sequence = str_pad($count + 1, 5, '0', STR_PAD_LEFT);

            $prefix = match($type) {
                'incoming' => 'IN',
                'outgoing' => 'OUT',
                'internal' => 'INT',
                default    => 'LET',
            };

            return "{$prefix}/{$year}/{$month}/{$sequence}";
        });
    }

    /**
     * تولید شماره رهگیری
     */
    public function generateTracking(): string
    {
        return strtoupper(uniqid('TRK-'));
    }
}
