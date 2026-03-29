<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use App\Services\WorkflowService;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class CartableController extends Controller
{
    public function __construct(
        private WorkflowService $workflowService,
        private ReportService   $reportService,
    ) {}

    public function index(Request $request): Response
    {
        $user = auth()->user();

        $routings = Routing::with(['letter.category', 'fromUser'])
            ->pendingForUser($user->id)
            ->latest()
            ->paginate(15);

        $stats = $this->reportService->getDashboardStats($user->organization_id);

        return Inertia::render('Cartable/Index', [
            'routings' => $routings,
            'stats'    => $stats,
        ]);
    }

    public function complete(Request $request, Routing $routing)
    {
        $request->validate(['note' => 'nullable|string|max:1000']);
        $this->workflowService->complete($routing, auth()->user(), $request->note ?? '');

        return back()->with('success', 'ارجاع با موفقیت تکمیل شد.');
    }

    public function reject(Request $request, Routing $routing)
    {
        $request->validate(['reason' => 'required|string|max:500']);
        $this->workflowService->reject($routing, auth()->user(), $request->reason);

        return back()->with('success', 'ارجاع رد شد.');
    }
}