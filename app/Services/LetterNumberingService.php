<?php

namespace App\Services;

use App\Models\Letter;
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;

class LetterNumberingService
{
    private array $config;

    public function __construct()
    {
        $this->config = config('correspondence.letter_numbering');
    }

    public function generate(string $type, int $organizationId): string
    {
        return DB::transaction(function () use ($type, $organizationId) {
            $now = Jalalian::now();
            $year = $now->getYear();
            $month = str_pad($now->getMonth(), 2, '0', STR_PAD_LEFT);

            $prefix = $this->getTypePrefix($type);

            // Atomic sequence increment
            $sequence = $this->getNextSequence($type, $organizationId, $year);

            $pattern = $this->config['pattern'];
            $padding = $this->config['padding'];

            return str_replace(
                ['{type}', '{year}', '{month}', '{sequence}'],
                [$prefix, $year, $month, str_pad($sequence, $padding, '0', STR_PAD_LEFT)],
                $pattern
            );
        });
    }

    private function getNextSequence(string $type, int $orgId, int $year): int
    {
        $key = "letter_seq_{$orgId}_{$type}_{$year}";

        $result = DB::table('system_settings')
            ->where('organization_id', $orgId)
            ->where('group', 'sequences')
            ->where('key', $key)
            ->lockForUpdate()
            ->first();

        if ($result) {
            $next = (int) $result->value + 1;
            DB::table('system_settings')
                ->where('organization_id', $orgId)
                ->where('group', 'sequences')
                ->where('key', $key)
                ->update(['value' => $next]);
        } else {
            $next = 1;
            DB::table('system_settings')->insert([
                'organization_id' => $orgId,
                'group' => 'sequences',
                'key' => $key,
                'value' => 1,
                'type' => 'number',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $next;
    }

    private function getTypePrefix(string $type): string
    {
        return match($type) {
            'incoming' => 'و',
            'outgoing' => 'ص',
            'internal' => 'د',
            default    => 'ع',
        };
    }

    public function generateTracking(): string
    {
        return strtoupper(uniqid('TRK-'));
    }
}