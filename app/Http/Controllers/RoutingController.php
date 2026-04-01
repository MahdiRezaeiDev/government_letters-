<?php
namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Routing;
use App\Models\Action;
use App\Models\User;
use App\Models\Position;
use Illuminate\Http\Request;

class RoutingController extends Controller
{
    // ارجاع نامه به یه نفر
    public function store(Request $request, Letter $letter)
    {
        $validated = $request->validate([
            'to_user_id'     => 'nullable|exists:users,id',
            'to_position_id' => 'nullable|exists:positions,id',
            'action_type'    => 'required|in:action,approval,information,sign,coordination',
            'instruction'    => 'nullable|string|max:500',
            'deadline'       => 'nullable|date|after:today',
        ]);

        $user  = auth()->user();
        $posId = $user->activePosition?->id;

        // شماره ترتیب — بعد از آخرین routing
        $stepOrder = Routing::where('letter_id', $letter->id)->max('step_order') + 1;

        Routing::create([
            ...$validated,
            'letter_id'        => $letter->id,
            'from_user_id'     => $user->id,
            'from_position_id' => $posId,
            'step_order'       => $stepOrder,
            'status'           => 'pending',
        ]);

        // وضعیت نامه رو آپدیت کن
        $letter->update([
            'final_status' => 'pending',
            'is_draft'     => false,
        ]);

        return back()->with('success', 'نامه ارجاع داده شد');
    }

    // اقدام روی routing
    public function action(Request $request, Routing $routing)
    {
        $validated = $request->validate([
            'action_type' => 'required|in:complete,reject,forward',
            'description' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();

        // لاگ اقدام
        Action::create([
            'routing_id'  => $routing->id,
            'user_id'     => $user->id,
            'action_type' => $validated['action_type'],
            'description' => $validated['description'],
            'ip_address'  => $request->ip(),
        ]);

        // آپدیت وضعیت routing
        $status = match($validated['action_type']) {
            'complete' => 'completed',
            'reject'   => 'rejected',
            'forward'  => 'in_progress',
        };

        $routing->update([
            'status'         => $status,
            'completed_at'   => now(),
            'completed_note' => $validated['description'],
        ]);

        // اگه تأیید بود و آخرین مرحله — نامه approved بشه
        if ($validated['action_type'] === 'complete'
            && $routing->action_type === 'approval') {

            $hasMorePending = Routing::where('letter_id', $routing->letter_id)
                ->where('status', 'pending')
                ->where('id', '!=', $routing->id)
                ->exists();

            if (!$hasMorePending) {
                $routing->letter->update(['final_status' => 'approved']);
            }
        }

        // اگه رد شد — نامه rejected بشه
        if ($validated['action_type'] === 'reject') {
            $routing->letter->update(['final_status' => 'rejected']);
        }

        return back()->with('success', 'اقدام ثبت شد');
    }
}