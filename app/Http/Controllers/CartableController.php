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

        // ─── ارجاعات در انتظار اقدام من ───
        $pendingRoutings = Routing::where(function ($q) use ($user, $posId) {
                $q->where('to_user_id', $user->id);
                if ($posId) {
                    $q->orWhere('to_position_id', $posId);
                }
            })
            ->where('status', 'pending')
            ->with([
                'letter:id,subject,letter_number,priority,final_status,date',
                'fromUser:id,first_name,last_name',
                'fromPosition:id,name',
            ])
            ->latest()
            ->get();

        // ─── نامه‌های وارده به سمت من (هنوز بررسی نشده) ───
        $incomingLetters = Letter::where('recipient_id', $posId)
            ->whereIn('final_status', ['pending', 'approved'])
            ->with(['category:id,name'])
            ->latest()
            ->take(10)
            ->get();

        // ─── نامه‌هایی که من فرستادم و الان در جریانه ───
        $sentLetters = Letter::where('created_by', $user->id)
            ->where('final_status', 'pending')
            ->with(['category:id,name'])
            ->latest()
            ->take(5)
            ->get();

        // ─── پیش‌نویس‌های من ───
        $myDrafts = Letter::where('created_by', $user->id)
            ->where('final_status', 'draft')
            ->latest()
            ->take(5)
            ->get();

        // ─── نامه‌های معوق (مهلت گذشته) ───
        $overdueRoutings = Routing::where(function ($q) use ($user, $posId) {
                $q->where('to_user_id', $user->id);
                if ($posId) {
                    $q->orWhere('to_position_id', $posId);
                }
            })
            ->where('status', 'pending')
            ->whereNotNull('deadline')
            ->where('deadline', '<', now())
            ->with(['letter:id,subject,letter_number,priority'])
            ->get();

        // ─── آمار ───
        $stats = [
            'pending_actions' => $pendingRoutings->count(),
            'incoming_new'    => $incomingLetters->count(),
            'sent_pending'    => $sentLetters->count(),
            'my_drafts'       => $myDrafts->count(),
            'overdue'         => $overdueRoutings->count(),
            'sent_today'      => Letter::where('created_by', $user->id)
                                       ->whereDate('created_at', today())
                                       ->count(),
        ];

        return Inertia::render('Cartable/Index', [
            'pendingRoutings' => $pendingRoutings,
            'incomingLetters' => $incomingLetters,
            'sentLetters'     => $sentLetters,
            'myDrafts'        => $myDrafts,
            'overdueRoutings' => $overdueRoutings,
            'stats'           => $stats,
        ]);
    }
}