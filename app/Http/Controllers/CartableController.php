<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use App\Services\WorkflowService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartableController extends Controller
{
    public function __construct(private WorkflowService $workflowService) {}

    /**
     * کارتابل شخصی کاربر
     */
    public function index(Request $request)
    {
        $user     = Auth::user();
        $cartable = $this->workflowService->getCartable($user, $request->only('priority', 'action_type', 'overdue'));
        $stats    = $this->workflowService->getCartableStats($user);

        return Inertia::render('Dashboard/Cartable', [
            'cartable' => $cartable,
            'stats'    => $stats,
            'filters'  => $request->only('priority', 'action_type', 'overdue'),
        ]);
    }

    /**
     * تکمیل ارجاع
     */
    public function complete(Request $request, Routing $routing)
    {
        $this->authorize('complete', $routing);

        $request->validate(['note' => 'nullable|string|max:1000']);

        $this->workflowService->complete($routing, $request->note);

        return back()->with('success', 'ارجاع با موفقیت تکمیل شد.');
    }

    /**
     * رد ارجاع
     */
    public function reject(Request $request, Routing $routing)
    {
        $this->authorize('complete', $routing);

        $request->validate(['reason' => 'required|string|max:1000']);

        $this->workflowService->reject($routing, $request->reason);

        return back()->with('success', 'ارجاع رد شد.');
    }
}
