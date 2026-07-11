<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Letter;
use App\Models\Organization;
use App\Models\Routing;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;

class ReportService
{
    public function __construct(private ReceptionService $receptionService) {}

    public function isReceptionUser(User $user): bool
    {
        return Department::where('reception_user_id', $user->id)->exists();
    }

    public function canAccessReports(User $user): bool
    {
        return $user->can('view-reports') || $this->isReceptionUser($user);
    }

    public function resolveContext(User $user): array
    {
        if ($user->isSuperAdmin()) {
            return [
                'role'        => 'super-admin',
                'title'       => 'گزارشات جامع سامانه',
                'description' => 'آمار و تحلیل تمام مکاتیب در سطح کشور',
                'scope_label' => 'کل سامانه',
            ];
        }

        if ($user->isOrgAdmin()) {
            return [
                'role'        => 'org-admin',
                'title'       => 'گزارشات سازمانی',
                'description' => 'آمار مکاتیب وزارت‌خانه شما',
                'scope_label' => $user->organization?->name ?? 'سازمان',
            ];
        }

        if ($user->isDeptManager()) {
            return [
                'role'        => 'dept-manager',
                'title'       => 'گزارشات ریاست',
                'description' => 'آمار مکاتیب ریاست و زیرمجموعه‌ها',
                'scope_label' => $user->department?->name ?? 'ریاست',
            ];
        }

        if ($this->isReceptionUser($user)) {
            return [
                'role'        => 'reception',
                'title'       => 'گزارشات دبیرخانه',
                'description' => 'آمار دریافت، ارجاع و پاسخ‌های دبیرخانه',
                'scope_label' => 'دبیرخانه',
            ];
        }

        return [
            'role'        => 'user',
            'title'       => 'گزارشات شخصی',
            'description' => 'آمار مکاتیب مرتبط با شما',
            'scope_label' => 'شخصی',
        ];
    }

    public function scopeBaseQuery(User $user): Builder
    {
        $query = Letter::query()->where('is_draft', false);

        if ($user->isSuperAdmin()) {
            return $query;
        }

        if ($user->isOrgAdmin()) {
            return $query->where(function ($q) use ($user) {
                $q->where('organization_id', $user->organization_id)
                    ->orWhere('recipient_organization_id', $user->organization_id);
            });
        }

        if ($user->isDeptManager()) {
            return $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                    ->orWhere('recipient_department_id', $user->department_id);
            });
        }

        if ($this->isReceptionUser($user)) {
            $rootDepts = $this->receptionService->getManagedRootDepartments($user);
            $deptIds   = $this->receptionService->getManagedDepartmentIds($rootDepts);

            return $query->whereIn('recipient_department_id', $deptIds);
        }

        return $query->where(function ($q) use ($user) {
            $q->where('sender_user_id', $user->id)
                ->orWhere('recipient_user_id', $user->id)
                ->orWhere('created_by', $user->id);
        });
    }

    public function applyFilters(Builder $query, Request $request): Builder
    {
        $query->when($request->filled('date_from'), function ($q) use ($request) {
            $from = $this->convertToGregorian($request->date_from);

            return $from ? $q->whereDate('created_at', '>=', $from) : $q;
        });

        $query->when($request->filled('date_to'), function ($q) use ($request) {
            $to = $this->convertToGregorian($request->date_to);

            return $to ? $q->whereDate('created_at', '<=', $to) : $q;
        });

        $query->when($request->filled('type') && $request->type !== 'all', function ($q) use ($request) {
            return $q->where('letter_type', $request->type);
        });

        $query->when($request->filled('status') && $request->status !== 'all', function ($q) use ($request) {
            return $q->where('final_status', $request->status);
        });

        $query->when($request->filled('priority') && $request->priority !== 'all', function ($q) use ($request) {
            return $q->where('priority', $request->priority);
        });

        $query->when($request->filled('organization_id'), function ($q) use ($request) {
            return $q->where('organization_id', $request->organization_id);
        });

        $query->when($request->filled('department_id'), function ($q) use ($request) {
            return $q->where(function ($sub) use ($request) {
                $sub->where('sender_department_id', $request->department_id)
                    ->orWhere('recipient_department_id', $request->department_id);
            });
        });

        return $query;
    }

    public function buildReport(User $user, Request $request): array
    {
        $context = $this->resolveContext($user);
        $query   = $this->applyFilters($this->scopeBaseQuery($user), $request);

        $report = [
            'context'               => $context,
            'overview'              => $this->buildOverview($query),
            'monthly_trend'         => $this->buildMonthlyTrend($query),
            'type_distribution'     => $this->buildTypeDistribution($query),
            'status_distribution'   => $this->buildStatusDistribution($query),
            'priority_distribution' => $this->buildPriorityDistribution($query),
        ];

        if ($context['role'] === 'super-admin') {
            $report['organization_stats'] = $this->buildOrganizationStats($query);
            $report['department_stats']   = $this->buildDepartmentStats($query, $user);
        }

        if ($context['role'] === 'org-admin') {
            $report['department_stats']  = $this->buildDepartmentStats($query, $user);
            $report['user_performance']  = $this->buildUserPerformance($query);
        }

        if ($context['role'] === 'dept-manager') {
            $report['routing_stats']     = $this->buildRoutingStats($user);
            $report['user_performance']  = $this->buildUserPerformance($query);
        }

        if ($context['role'] === 'reception') {
            $rootDepts = $this->receptionService->getManagedRootDepartments($user);
            $deptIds   = $this->receptionService->getManagedDepartmentIds($rootDepts);

            $report['reception_stats']      = $this->receptionService->buildStats($user, $rootDepts, $deptIds);
            $report['department_breakdown'] = $this->receptionService->buildDepartmentBreakdown($user, $rootDepts);
            $report['monthly_trend']        = $this->formatReceptionMonthlyTrend(
                $this->receptionService->buildMonthlyTrend($deptIds)
            );
        }

        return $report;
    }

    public function getFilterOptions(User $user): array
    {
        $options = [
            'organizations' => [],
            'departments'   => [],
        ];

        if ($user->isSuperAdmin()) {
            $options['organizations'] = Organization::where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->toArray();
        }

        if ($user->isSuperAdmin() || $user->isOrgAdmin()) {
            $deptQuery = Department::where('status', 'active')->orderBy('name');

            if ($user->isOrgAdmin()) {
                $deptQuery->where('organization_id', $user->organization_id);
            }

            $options['departments'] = $deptQuery->get(['id', 'name'])->toArray();
        }

        return $options;
    }

    protected function buildOverview(Builder $query): array
    {
        return [
            'total'     => (clone $query)->count(),
            'incoming'  => (clone $query)->where('letter_type', 'incoming')->count(),
            'outgoing'  => (clone $query)->where('letter_type', 'outgoing')->count(),
            'internal'  => (clone $query)->where('letter_type', 'internal')->count(),
            'pending'   => (clone $query)->where('final_status', 'pending')->count(),
            'approved'  => (clone $query)->where('final_status', 'approved')->count(),
            'rejected'  => (clone $query)->where('final_status', 'rejected')->count(),
            'archived'  => (clone $query)->where('final_status', 'archived')->count(),
            'replied'   => (clone $query)->has('replies')->count(),
            'urgent'    => (clone $query)->whereIn('priority', ['urgent', 'very_urgent'])->count(),
            'today'     => (clone $query)->whereDate('created_at', today())->count(),
            'this_week' => (clone $query)->where('created_at', '>=', now()->startOfWeek())->count(),
            'this_month'=> (clone $query)->where('created_at', '>=', now()->startOfMonth())->count(),
        ];
    }

    protected function buildMonthlyTrend(Builder $query): array
    {
        $since  = now()->subMonths(5)->startOfMonth();
        $counts = (clone $query)
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month');

        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $key  = $date->format('Y-m');
            $months[] = [
                'month' => $this->jalaliMonthLabel($date),
                'count' => (int) ($counts[$key] ?? 0),
            ];
        }

        return $months;
    }

    protected function formatReceptionMonthlyTrend(array $trend): array
    {
        return collect($trend)->map(function ($row) {
            try {
                [$year, $month] = explode('-', $row['month']);
                $label = $this->jalaliMonthLabel(Jalalian::fromFormat('Y-m-d', "{$year}-{$month}-01")->toCarbon());
            } catch (\Exception $e) {
                $label = $row['month'];
            }

            return [
                'month'    => $label,
                'incoming' => $row['incoming'],
                'replies'  => $row['replies'],
            ];
        })->all();
    }

    protected function buildTypeDistribution(Builder $query): array
    {
        $labels = ['incoming' => 'وارده', 'outgoing' => 'صادره', 'internal' => 'داخلی'];
        $colors = ['incoming' => '#10b981', 'outgoing' => '#8b5cf6', 'internal' => '#6366f1'];

        return (clone $query)
            ->select('letter_type', DB::raw('COUNT(*) as count'))
            ->groupBy('letter_type')
            ->get()
            ->map(fn ($row) => [
                'name'  => $labels[$row->letter_type] ?? $row->letter_type,
                'value' => (int) $row->count,
                'color' => $colors[$row->letter_type] ?? '#64748b',
            ])
            ->values()
            ->all();
    }

    protected function buildStatusDistribution(Builder $query): array
    {
        $labels = [
            'pending'  => 'در انتظار',
            'approved' => 'تایید شده',
            'rejected' => 'رد شده',
            'archived' => 'بایگانی',
        ];
        $colors = [
            'pending'  => '#f59e0b',
            'approved' => '#10b981',
            'rejected' => '#ef4444',
            'archived' => '#6366f1',
        ];

        return (clone $query)
            ->select('final_status', DB::raw('COUNT(*) as count'))
            ->groupBy('final_status')
            ->get()
            ->map(fn ($row) => [
                'name'  => $labels[$row->final_status] ?? $row->final_status,
                'value' => (int) $row->count,
                'color' => $colors[$row->final_status] ?? '#64748b',
            ])
            ->values()
            ->all();
    }

    protected function buildPriorityDistribution(Builder $query): array
    {
        $labels = [
            'low'         => 'کم',
            'normal'      => 'عادی',
            'high'        => 'مهم',
            'urgent'      => 'عاجل',
            'very_urgent' => 'خیلی عاجل',
        ];
        $colors = [
            'low'         => '#94a3b8',
            'normal'      => '#3b82f6',
            'high'        => '#eab308',
            'urgent'      => '#f97316',
            'very_urgent' => '#ef4444',
        ];

        return (clone $query)
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'name'  => $labels[$row->priority] ?? $row->priority,
                'value' => (int) $row->count,
                'color' => $colors[$row->priority] ?? '#64748b',
            ])
            ->values()
            ->all();
    }

    protected function buildOrganizationStats(Builder $query): array
    {
        return (clone $query)
            ->select('organization_id', DB::raw('COUNT(*) as count'))
            ->whereNotNull('organization_id')
            ->groupBy('organization_id')
            ->orderByDesc('count')
            ->limit(10)
            ->with('organization:id,name')
            ->get()
            ->map(fn ($row) => [
                'name'  => $row->organization?->name ?? '—',
                'count' => (int) $row->count,
            ])
            ->values()
            ->all();
    }

    protected function buildDepartmentStats(Builder $query, User $user): array
    {
        $deptQuery = Department::where('status', 'active');

        if ($user->isOrgAdmin()) {
            $deptQuery->where('organization_id', $user->organization_id);
        }

        $departments = $deptQuery->get(['id', 'name']);
        $stats       = [];

        foreach ($departments as $department) {
            $count = (clone $query)
                ->where(function ($q) use ($department) {
                    $q->where('sender_department_id', $department->id)
                        ->orWhere('recipient_department_id', $department->id);
                })
                ->count();

            if ($count > 0) {
                $stats[] = [
                    'department' => $department->name,
                    'count'      => $count,
                ];
            }
        }

        usort($stats, fn ($a, $b) => $b['count'] <=> $a['count']);

        return array_slice($stats, 0, 10);
    }

    protected function buildUserPerformance(Builder $query): array
    {
        return (clone $query)
            ->select('sender_user_id', DB::raw('COUNT(*) as count'))
            ->whereNotNull('sender_user_id')
            ->groupBy('sender_user_id')
            ->orderByDesc('count')
            ->limit(8)
            ->with('senderUser:id,first_name,last_name')
            ->get()
            ->map(fn ($row) => [
                'name'  => $row->senderUser
                    ? trim($row->senderUser->first_name . ' ' . $row->senderUser->last_name)
                    : '—',
                'count' => (int) $row->count,
            ])
            ->values()
            ->all();
    }

    protected function buildRoutingStats(User $user): array
    {
        $base = Routing::query()
            ->whereHas('letter', function ($q) use ($user) {
                $q->where('is_draft', false)
                    ->where(function ($sub) use ($user) {
                        $sub->where('sender_department_id', $user->department_id)
                            ->orWhere('recipient_department_id', $user->department_id);
                    });
            });

        return [
            'total'     => (clone $base)->count(),
            'pending'   => (clone $base)->where('status', 'pending')->count(),
            'completed' => (clone $base)->where('status', 'completed')->count(),
            'rejected'  => (clone $base)->where('status', 'rejected')->count(),
            'reception' => (clone $base)->where('is_reception', true)->count(),
        ];
    }

    public function getExportRows(User $user, Request $request): \Illuminate\Support\Collection
    {
        return $this->applyFilters($this->scopeBaseQuery($user), $request)
            ->with(['senderDepartment:id,name', 'recipientDepartment:id,name', 'organization:id,name'])
            ->orderByDesc('created_at')
            ->get([
                'letter_number', 'subject', 'letter_type', 'priority',
                'final_status', 'sender_name', 'recipient_name', 'created_at',
            ]);
    }

    protected function jalaliMonthLabel($date): string
    {
        $months = [
            1 => 'حمل', 2 => 'ثور', 3 => 'جوزا', 4 => 'سرطان',
            5 => 'اسد', 6 => 'سنبله', 7 => 'میزان', 8 => 'عقرب',
            9 => 'قوس', 10 => 'جدی', 11 => 'دلو', 12 => 'حوت',
        ];

        try {
            $jalali = Jalalian::fromCarbon($date instanceof \Carbon\Carbon ? $date : $date->toMutable());

            return $months[$jalali->getMonth()] ?? (string) $jalali->getMonth();
        } catch (\Exception $e) {
            return $date->format('Y-m');
        }
    }

    public function convertToGregorian(?string $jalaliDate): ?string
    {
        if (empty($jalaliDate)) {
            return null;
        }

        $jalaliDate = str_replace(
            ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '/', '٫'],
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '-'],
            $jalaliDate
        );

        $jalaliDate = preg_replace('/[^\d\-]/', '', $jalaliDate);

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $jalaliDate)) {
            return null;
        }

        try {
            return Jalalian::fromFormat('Y-m-d', $jalaliDate)->toCarbon()->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
