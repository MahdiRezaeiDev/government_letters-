<?php
namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Routing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {

        $orgId = auth()->user()->organization_id;

        // بازه زمانی
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to   = $request->to   ?? now()->toDateString();

        // ─── آمار کلی ───
        $stats = [
            'total'    => Letter::where('organization_id', $orgId)
                                ->whereBetween('date', [$from, $to])
                                ->count(),
            'incoming' => Letter::where('organization_id', $orgId)
                                ->where('recipient_id', $orgId)
                                ->whereBetween('date', [$from, $to])
                                ->count(),
            'outgoing' => Letter::where('organization_id', $orgId)
                                ->where('sender_id', $orgId)
                                ->whereBetween('date', [$from, $to])
                                ->count(),
            'internal' => Letter::where('organization_id', $orgId)
                                ->where('letter_type', 'internal')
                                ->whereBetween('date', [$from, $to])
                                ->count(),
            'pending'  => Letter::where('organization_id', $orgId)
                                ->where('final_status', 'pending')
                                ->count(),
            'approved' => Letter::where('organization_id', $orgId)
                                ->where('final_status', 'approved')
                                ->whereBetween('date', [$from, $to])
                                ->count(),
        ];

        // ─── نامه بر اساس اولویت ───
        $byPriority = Letter::where('organization_id', $orgId)
            ->whereBetween('date', [$from, $to])
            ->selectRaw('priority, count(*) as count')
            ->groupBy('priority')
            ->pluck('count', 'priority');

        // ─── نامه بر اساس دسته‌بندی ───
        $byCategory = Letter::where('organization_id', $orgId)
            ->whereBetween('date', [$from, $to])
            ->whereNotNull('category_id')
            ->with('category:id,name')
            ->selectRaw('category_id, count(*) as count')
            ->groupBy('category_id')
            ->get()
            ->map(fn($item) => [
                'name'  => $item->category?->name ?? 'نامشخص',
                'count' => $item->count,
            ]);

        // ─── نامه روزانه (۳۰ روز اخیر) ───
        $daily = Letter::where('organization_id', $orgId)
            ->whereBetween('date', [
                now()->subDays(30)->toDateString(),
                now()->toDateString(),
            ])
            ->selectRaw('date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        // ─── نامه‌های معوق ───
        $overdue = Letter::where('organization_id', $orgId)
            ->where('final_status', 'pending')
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->toDateString())
            ->with(['category', 'creator'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Reports/Index', [
            'stats'      => $stats,
            'byPriority' => $byPriority,
            'byCategory' => $byCategory,
            'daily'      => $daily,
            'overdue'    => $overdue,
            'filters'    => ['from' => $from, 'to' => $to],
        ]);
    }
}