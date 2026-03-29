<?php
// app/Services/SearchService.php

namespace App\Services;

use App\Models\Letter;
use App\Models\LetterParty;
use Illuminate\Support\Facades\DB;

class SearchService
{
    /**
     * جستجوی جامع در نامه‌ها
     */
    public function searchLetters(int $orgId, string $query, array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $search = Letter::forOrganization($orgId)
            ->with(['category', 'creator', 'attachments'])
            ->where(function ($q) use ($query) {
                $q->where('subject', 'LIKE', "%{$query}%")
                  ->orWhere('letter_number', 'LIKE', "%{$query}%")
                  ->orWhere('tracking_number', 'LIKE', "%{$query}%")
                  ->orWhere('summary', 'LIKE', "%{$query}%")
                  ->orWhere('sender_name', 'LIKE', "%{$query}%")
                  ->orWhere('recipient_name', 'LIKE', "%{$query}%")
                  ->orWhereHas('keywords', fn($kq) => $kq->where('name', 'LIKE', "%{$query}%"))
                  ->orWhereHas('attachments', fn($aq) => $aq->where('ocr_text', 'LIKE', "%{$query}%"));
            });

        // فیلترها
        if ($filters['letter_type'] ?? null) {
            $search->where('letter_type', $filters['letter_type']);
        }

        if ($filters['date_from'] ?? null) {
            $search->where('date', '>=', $filters['date_from']);
        }

        if ($filters['date_to'] ?? null) {
            $search->where('date', '<=', $filters['date_to']);
        }

        if ($filters['priority'] ?? null) {
            $search->where('priority', $filters['priority']);
        }

        if ($filters['category_id'] ?? null) {
            $search->where('category_id', $filters['category_id']);
        }

        return $search->latest('date')->paginate($filters['per_page'] ?? 15);
    }

    /**
     * پیشنهاد کلمات کلیدی (autocomplete)
     */
    public function suggestKeywords(int $orgId, string $query): array
    {
        return \App\Models\Keyword::where('organization_id', $orgId)
            ->where('name', 'LIKE', "{$query}%")
            ->limit(10)
            ->pluck('name')
            ->toArray();
    }
}