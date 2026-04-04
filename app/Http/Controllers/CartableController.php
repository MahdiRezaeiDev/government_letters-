<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Routing;
use Inertia\Inertia;

class CartableController extends Controller
{
    public function index()
    {
        $user  = auth()->user();
        $posId = $user->activePosition?->id;
        $orgId = $user->organization_id;

        $pendingRoutings = Routing::where(function ($q) use ($user, $posId) {
                $q->where('to_user_id', $user->id)
                  ->orWhere('to_position_id', $posId);
            })
            ->where('status', 'pending')
            ->with(['letter', 'fromUser', 'fromPosition'])
            ->latest()
            ->get();

        $incomingLetters = Letter::where('recipient_id', $posId)
            ->where('final_status', 'pending')
            ->with(['category'])
            ->latest()
            ->take(10)
            ->get();

        $myDrafts = Letter::where('created_by', $user->id)
            ->where('is_draft', true)
            ->where('final_status', 'draft')
            ->latest()
            ->take(5)
            ->get();

        $stats = [
            'pending_actions' => $pendingRoutings->count(),
            'incoming_new'    => $incomingLetters->count(),
            'my_drafts'       => $myDrafts->count(),
            'sent_today'      => Letter::where('created_by', $user->id)
                                       ->whereDate('created_at', today())
                                       ->count(),
        ];

        return Inertia::render('Cartable/Index', [
            'pendingRoutings' => $pendingRoutings,
            'incomingLetters' => $incomingLetters,
            'myDrafts'        => $myDrafts,
            'stats'           => $stats,
        ]);
    }
}
