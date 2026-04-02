<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    // لیست همه نوتیفیکیشن‌ها
    public function index()
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        // همه رو خونده علامت بزن
        auth()->user()->unreadNotifications->markAsRead();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    // تعداد نخونده — برای header
    public function unreadCount()
    {
        return response()->json([
            'count' => auth()->user()->unreadNotifications()->count(),
        ]);
    }

    // یکی رو خونده علامت بزن
    public function markAsRead(string $id)
    {
        auth()->user()
            ->notifications()
            ->find($id)
            ?->markAsRead();

        return back();
    }

    // همه رو خونده علامت بزن
    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return back()->with('success', 'همه خوانده شد');
    }
}