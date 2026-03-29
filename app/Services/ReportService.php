<?php

namespace App\Services;

use App\Models\{Letter, Routing, User};
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;

class ReportService
{
    /**
     * آمار کلی داشبورد
     */
    public function getDashboardStats(int $organizationId): array
    {
        $today = now()->toDateString();

        return [
            'total_incoming'  => Letter::forOrganization($organizationId)->incoming()->count(),
            'total_outgoing'  => Letter::forOrganization($organizationId)->outgoing()->count(),
            'total_internal'  => Letter::forOrganization($organizationId)->internal()->count(),
            'pending_letters' => Letter::forOrganization($organizationId)->pending()->count(),
            'today_incoming'  => Letter::forOrganization($organizationId)->incoming()->whereDate('created_at', $today)->count(),
            'today_outgoing'  => Letter::forOrganization($organizationId)->outgoing()->whereDate('created_at', $today)->count(),
            'overdue_routings' => Routing::whereHas('letter', fn($q) => $q->where('organization_id', $organizationId))
                ->where('deadline', '<', now())
                ->whereIn('status', ['pending', 'in_progress'])
                ->count(),
        ];
    }

    /**
     * نمودار نامه‌ها بر اساس ماه (شمسی)
     */
    public function getMonthlyChart(int $organizationId, int $year): array
    {
        $data = Letter::forOrganization($organizationId)
            ->selectRaw('letter_type, MONTH(date) as month, COUNT(*) as count')
            ->whereYear('date', $year)
            ->groupBy('letter_type', 'month')
            ->get();

        $result = [];
        foreach (range(1, 12) as $month) {
            $jalaliMonth = Jalalian::fromDateTime(
                \Carbon\Carbon::createFromDate($year, $month, 1)
            )->getMonth();

            $result[$month] = [
                'month'    => $jalaliMonth,
                'incoming' => $data->where('letter_type', 'incoming')->where('month', $month)->sum('count'),
                'outgoing' => $data->where('letter_type', 'outgoing')->where('month', $month)->sum('count'),
                'internal' => $data->where('letter_type', 'internal')->where('month', $month)->sum('count'),
            ];
        }

        return array_values($result);
    }

    /**
     * گزارش کارکرد کاربران
     */
    public function getUserPerformance(int $organizationId): array
    {
        return User::where('organization_id', $organizationId)
            ->withCount([
                'routings as completed_routings' => fn($q) => $q->where('status', 'completed'),
                'routings as pending_routings'   => fn($q) => $q->whereIn('status', ['pending', 'in_progress']),
            ])
            ->get()
            ->map(fn($user) => [
                'name'      => $user->full_name,
                'completed' => $user->completed_routings,
                'pending'   => $user->pending_routings,
            ])
            ->toArray();
    }
}