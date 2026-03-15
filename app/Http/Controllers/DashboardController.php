<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Routing;
use App\Models\Announcement;
use App\Services\WorkflowService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private WorkflowService $workflowService) {}

    public function index()
    {
        $user  = Auth::user();
        $orgId = $user->organization_id;

        // آمار کلی نامه‌ها
        $letterStats = [
            'incoming' => Letter::where('organization_id', $orgId)->where('letter_type', 'incoming')->count(),
            'outgoing' => Letter::where('organization_id', $orgId)->where('letter_type', 'outgoing')->count(),
            'internal' => Letter::where('organization_id', $orgId)->where('letter_type', 'internal')->count(),
            'pending'  => Letter::where('organization_id', $orgId)->where('final_status', 'pending')->count(),
        ];

        // آمار کارتابل
        $cartableStats = $this->workflowService->getCartableStats($user);

        // آخرین نامه‌ها
        $recentLetters = Letter::with(['category', 'createdBy'])
            ->where('organization_id', $orgId)
            ->latest()
            ->take(5)
            ->get();

        // اطلاعیه‌های فعال
        $announcements = Announcement::where('organization_id', $orgId)
            ->where('is_published', true)
            ->where(function($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>', now());
            })
            ->latest('publish_date')
            ->take(3)
            ->get();

        // نمودار نامه‌های ماه جاری (7 روز گذشته)
        $chartData = Letter::where('organization_id', $orgId)
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, letter_type, COUNT(*) as count')
            ->groupBy('date', 'letter_type')
            ->get();

        return Inertia::render('Dashboard/Index', [
            'letterStats'    => $letterStats,
            'cartableStats'  => $cartableStats,
            'recentLetters'  => $recentLetters,
            'announcements'  => $announcements,
            'chartData'      => $chartData,
        ]);
    }
}
