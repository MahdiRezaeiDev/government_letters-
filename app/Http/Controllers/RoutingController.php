<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Letter;
use App\Models\Routing;
use App\Models\User;
use App\Notifications\LetterRoutedNotification;
use Illuminate\Http\Request;

class RoutingController extends Controller
{
    public function store(Request $request, Letter $letter)
    {
        $validated = $request->validate([
            'to_user_id'     => 'nullable|exists:users,id',
            'to_position_id' => 'nullable|exists:positions,id',
            'action_type'    => 'required|in:action,approval,information,sign,coordination',
            'instruction'    => 'nullable|string|max:500',
            'deadline'       => 'nullable|date|after:today',
        ]);

        $user      = auth()->user();
        $stepOrder = Routing::where('letter_id', $letter->id)->max('step_order') + 1;

        $routing = Routing::create([
            ...$validated,
            'letter_id'        => $letter->id,
            'from_user_id'     => $user->id,
            'from_position_id' => $user->activePosition?->id,
            'step_order'       => $stepOrder,
            'status'           => 'pending',
        ]);

        $letter->update([
            'final_status' => 'pending',
            'is_draft'     => false,
        ]);

        // نوتیفیکیشن
        $recipient = null;
        if ($validated['to_user_id']) {
            $recipient = User::find($validated['to_user_id']);
        } elseif ($validated['to_position_id']) {
            $recipient = User::whereHas('activeUserPosition', fn($q) =>
                $q->where('position_id', $validated['to_position_id'])
            )->first();
        }

        if ($recipient) {
            $recipient->notify(new LetterRoutedNotification($routing));
        }

        return back()->with('success', 'نامه ارجاع داده شد');
    }

    public function action(Request $request, Routing $routing)
    {
        $validated = $request->validate([
            'action_type' => 'required|in:complete,reject,forward',
            'description' => 'nullable|string|max:1000',
        ]);

        Action::create([
            'routing_id'  => $routing->id,
            'user_id'     => auth()->id(),
            'action_type' => $validated['action_type'],
            'description' => $validated['description'],
            'ip_address'  => $request->ip(),
        ]);

        $status = match ($validated['action_type']) {
            'complete' => 'completed',
            'reject'   => 'rejected',
            'forward'  => 'in_progress',
        };

        $routing->update([
            'status'         => $status,
            'completed_at'   => now(),
            'completed_note' => $validated['description'],
        ]);

        if ($validated['action_type'] === 'complete' && $routing->action_type === 'approval') {
            $hasMorePending = Routing::where('letter_id', $routing->letter_id)
                ->where('status', 'pending')
                ->where('id', '!=', $routing->id)
                ->exists();

            if (!$hasMorePending) {
                $routing->letter->update(['final_status' => 'approved']);
            }
        }

        if ($validated['action_type'] === 'reject') {
            $routing->letter->update(['final_status' => 'rejected']);
        }

        return back()->with('success', 'اقدام ثبت شد');
    }
}
