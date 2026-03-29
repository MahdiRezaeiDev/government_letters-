<?php

namespace App\Http\Controllers;

use App\Http\Requests\Routing\StoreRoutingRequest;
use App\Models\{Letter, Routing};
use App\Services\WorkflowService;
use Inertia\{Inertia, Response};

class RoutingController extends Controller
{
    public function __construct(private WorkflowService $workflowService) {}

    public function store(StoreRoutingRequest $request, Letter $letter)
    {
        $this->authorize('route', $letter);

        $this->workflowService->route(
            letter:       $letter,
            fromUser:     auth()->user(),
            toRecipients: $request->validated('recipients'),
            isParallel:   $request->boolean('is_parallel'),
        );

        return back()->with('success', 'نامه ارجاع داده شد.');
    }

    public function history(Letter $letter): Response
    {
        $routings = Routing::with(['toUser', 'fromUser', 'actions.user'])
            ->where('letter_id', $letter->id)
            ->orderBy('step_order')
            ->get();

        return Inertia::render('Routing/History', [
            'letter'   => $letter,
            'routings' => $routings,
        ]);
    }
}