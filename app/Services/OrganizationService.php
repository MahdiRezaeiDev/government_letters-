<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Organization;
use Illuminate\Support\Facades\Cache;

class OrganizationService
{
    private const CACHE_TTL = 3600; // 1 ساعت

    public function getTree(int $organizationId): array
    {
        return Cache::remember(
            "org_tree_{$organizationId}",
            self::CACHE_TTL,
            fn() => $this->buildTree($organizationId)
        );
    }

    private function buildTree(int $organizationId): array
    {
        $departments = Department::with('positions')
            ->where('organization_id', $organizationId)
            ->where('status', 'active')
            ->orderBy('level')
            ->orderBy('name')
            ->get();

        return $this->nestDepartments($departments);
    }

    private function nestDepartments($departments, ?int $parentId = null): array
    {
        $result = [];

        foreach ($departments as $dept) {
            if ($dept->parent_id == $parentId) {
                $children = $this->nestDepartments($departments, $dept->id);
                $node = $dept->toArray();
                $node['children'] = $children;
                $result[] = $node;
            }
        }

        return $result;
    }

    // پاک کردن Cache سازمان هنگام تغییر
    public function clearCache(int $organizationId): void
    {
        Cache::forget("org_tree_{$organizationId}");
    }
}