<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Morilog\Jalali\Jalalian;

class AdminLetterController extends Controller
{
    /**
     * داشبورد سوپر ادمین — دسترسی به تمام مکاتیب با فیلترهای پیشرفته
     */
    public function index(Request $request)
    {
        $query = $this->buildFilteredQuery($request);

        // آمار بر اساس همان فیلترهای اعمال‌شده محاسبه می‌شود
        $stats = $this->buildStats(clone $query);
        $monthlyTrend = $this->buildMonthlyTrend(clone $query);
        $statusDistribution = $this->buildStatusDistribution(clone $query);
        $topOrganizations = $this->buildTopOrganizations(clone $query);

        $letters = $query
            ->with([
                'category:id,name',
                'organization:id,name',
                'recipientOrganization:id,name',
                'senderDepartment:id,name',
                'recipientDepartment:id,name',
                'senderUser:id,first_name,last_name',
                'recipientUser:id,first_name,last_name',
            ])
            ->withCount('replies')
            ->orderBy(
                in_array($request->input('sort_by'), ['created_at', 'date', 'priority', 'final_status', 'letter_number']) ? $request->input('sort_by') : 'created_at',
                $request->input('sort_dir') === 'asc' ? 'asc' : 'desc'
            )
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/letters', [
            'letters'            => $letters,
            'stats'              => $stats,
            'monthlyTrend'       => $monthlyTrend,
            'statusDistribution' => $statusDistribution,
            'topOrganizations'   => $topOrganizations,
            'organizations'      => Organization::orderBy('name')->get(['id', 'name']),
            'categories'         => LetterCategory::where('status', true)->orderBy('name')->get(['id', 'name']),
            'filters'            => $request->only([
                'search', 'organization_id', 'sender_department_id', 'recipient_department_id',
                'letter_type', 'status', 'priority', 'security_level', 'category_id',
                'date_from', 'date_to', 'has_replies', 'is_draft', 'sender_name',
                'recipient_name', 'sort_by', 'sort_dir',
            ]),
        ]);
    }

    /**
     * ساخت کوئری با فیلترهای پیشرفته
     */
    protected function buildFilteredQuery(Request $request)
    {
        $query = Letter::query();

        // وزارت (فرستنده یا گیرنده)
        $query->when($request->filled('organization_id'), function ($q) use ($request) {
            $q->where(function ($sub) use ($request) {
                $sub->where('organization_id', $request->organization_id)
                    ->orWhere('recipient_organization_id', $request->organization_id);
            });
        });

        // ریاست فرستنده / گیرنده
        $query->when($request->filled('sender_department_id'), fn ($q) => $q->where('sender_department_id', $request->sender_department_id));
        $query->when($request->filled('recipient_department_id'), fn ($q) => $q->where('recipient_department_id', $request->recipient_department_id));

        // نام فرستنده / گیرنده
        $query->when($request->filled('sender_name'), fn ($q) => $q->where('sender_name', 'like', "%{$request->sender_name}%"));
        $query->when($request->filled('recipient_name'), fn ($q) => $q->where('recipient_name', 'like', "%{$request->recipient_name}%"));

        // نوع، وضعیت، اولویت، سطح امنیتی، کتگوری
        $query->when($request->filled('letter_type'), fn ($q) => $q->where('letter_type', $request->letter_type));
        $query->when($request->filled('status'), fn ($q) => $q->where('final_status', $request->status));
        $query->when($request->filled('priority'), fn ($q) => $q->where('priority', $request->priority));
        $query->when($request->filled('security_level'), fn ($q) => $q->where('security_level', $request->security_level));
        $query->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->category_id));

        // پیش‌نویس / دارای پاسخ
        $query->when($request->filled('is_draft'), fn ($q) => $q->where('is_draft', $request->is_draft === '1'));
        $query->when($request->filled('has_replies'), function ($q) use ($request) {
            return $request->has_replies === '1'
                ? $q->has('replies')
                : $q->doesntHave('replies');
        });

        // بازه تاریخ
        $query->when($request->filled('date_from'), function ($q) use ($request) {
            $from = $this->convertToGregorian($request->date_from);
            return $from ? $q->whereDate('created_at', '>=', $from) : $q;
        });
        $query->when($request->filled('date_to'), function ($q) use ($request) {
            $to = $this->convertToGregorian($request->date_to);
            return $to ? $q->whereDate('created_at', '<=', $to) : $q;
        });

        // جستجوی متنی
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->search;
            return $q->where(function ($s) use ($search) {
                $s->where('subject', 'like', "%{$search}%")
                    ->orWhere('letter_number', 'like', "%{$search}%")
                    ->orWhere('tracking_number', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('sender_name', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%");
            });
        });

        return $query;
    }

    protected function buildStats($query): array
    {
        return [
            'total'       => (clone $query)->count(),
            'pending'     => (clone $query)->where('final_status', 'pending')->count(),
            'approved'    => (clone $query)->where('final_status', 'approved')->count(),
            'rejected'    => (clone $query)->where('final_status', 'rejected')->count(),
            'draft'       => (clone $query)->where('is_draft', true)->count(),
            'archived'    => (clone $query)->where('final_status', 'archived')->count(),
            'replied'     => (clone $query)->has('replies')->count(),
            'today'       => (clone $query)->whereDate('created_at', today())->count(),
            'this_week'   => (clone $query)->where('created_at', '>=', now()->startOfWeek())->count(),
            'this_month'  => (clone $query)->where('created_at', '>=', now()->startOfMonth())->count(),
            'urgent'      => (clone $query)->whereIn('priority', ['urgent', 'very_urgent'])->count(),
        ];
    }

    protected function buildMonthlyTrend($query): array
    {
        $since = now()->subMonths(11)->startOfMonth();

        $counts = (clone $query)
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month');

        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $key = now()->subMonths($i)->format('Y-m');
            $months[] = [
                'month' => $key,
                'count' => (int) ($counts[$key] ?? 0),
            ];
        }

        return $months;
    }

    protected function buildStatusDistribution($query): array
    {
        $labels = [
            'draft'    => 'پیش‌نویس',
            'pending'  => 'در انتظار',
            'approved' => 'تایید شده',
            'rejected' => 'رد شده',
            'archived' => 'بایگانی',
        ];

        $colors = [
            'draft'    => '#94a3b8',
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

    protected function buildTopOrganizations($query): array
    {
        return (clone $query)
            ->select('organization_id', DB::raw('COUNT(*) as count'))
            ->whereNotNull('organization_id')
            ->groupBy('organization_id')
            ->orderByDesc('count')
            ->limit(8)
            ->with('organization:id,name')
            ->get()
            ->map(fn ($row) => [
                'name'  => $row->organization?->name ?? '—',
                'count' => (int) $row->count,
            ])
            ->values()
            ->all();
    }

    private function convertToGregorian(?string $jalaliDate): ?string
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
