<?php
// app/Repositories/LetterRepository.php

namespace App\Repositories;

use App\Models\Letter;
use App\Repositories\Contracts\LetterRepositoryInterface;
use App\Services\LetterNumberingService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LetterRepository implements LetterRepositoryInterface
{
    public function __construct(
        private readonly LetterNumberingService $numberingService
    ) {}

    public function create(array $data): Letter
    {
        return DB::transaction(function () use ($data) {
            $orgId = Auth::user()->organization_id;

            // شماره‌گذاری اتوماتیک
            if (empty($data['letter_number']) && !($data['is_draft'] ?? false)) {
                $data['letter_number'] = $this->numberingService->generate($orgId, $data['letter_type']);
            }

            $data['tracking_number'] = $this->numberingService->generateTracking($orgId);
            $data['organization_id'] = $orgId;
            $data['created_by']      = Auth::id();

            $letter = Letter::create($data);

            // ذخیره کلمات کلیدی
            if (!empty($data['keywords'])) {
                $this->syncKeywords($letter, $data['keywords']);
            }

            return $letter;
        });
    }

    public function update(Letter $letter, array $data): Letter
    {
        DB::transaction(function () use ($letter, $data) {
            // اگر از پیش‌نویس به نهایی تبدیل شد، شماره بده
            if ($letter->is_draft && !($data['is_draft'] ?? true)) {
                $data['letter_number'] = $this->numberingService->generate(
                    $letter->organization_id,
                    $data['letter_type'] ?? $letter->letter_type
                );
            }

            $data['updated_by'] = Auth::id();
            $letter->update($data);

            if (array_key_exists('keywords', $data)) {
                $this->syncKeywords($letter, $data['keywords']);
            }
        });

        return $letter->fresh();
    }

    public function findByTracking(string $trackingNumber): ?Letter
    {
        return Letter::where('tracking_number', $trackingNumber)
                     ->with(['category', 'attachments', 'routings', 'creator'])
                     ->first();
    }

    private function syncKeywords(Letter $letter, array $keywords): void
    {
        $orgId = $letter->organization_id;
        $keywordIds = [];

        foreach ($keywords as $keyword) {
            $kw = \App\Models\Keyword::firstOrCreate(
                ['organization_id' => $orgId, 'name' => $keyword],
            );
            $keywordIds[] = $kw->id;
        }

        $letter->keywords()->sync($keywordIds);
    }
}