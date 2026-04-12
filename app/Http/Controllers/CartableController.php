<?php

namespace App\Http\Controllers;

use App\Models\Routing;
use App\Models\Letter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Morilog\Jalali\Jalalian;

class CartableController extends Controller
{
    /**
     * نمایش کارتابل شخصی کاربر
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // ============================================
        // دریافت ارجاعات کاربر
        // ============================================
        
        $query = Routing::query()
            ->with([
                'letter' => function ($q) {
                    $q->with(['senderDepartment', 'recipientDepartment', 'category', 'creator']);
                },
                'fromUser',
                'toUser',
                'fromPosition',
                'toPosition',
            ])
            ->where(function ($q) use ($user) {
                // ارجاعات به کاربر فعلی
                $q->where('to_user_id', $user->id)
                  // یا ارجاعات به سمت کاربر فعلی
                  ->orWhereIn('to_position_id', [$user->id]);
            });
        
        // فیلتر بر اساس وضعیت
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        } else {
            // پیش‌فرض: نمایش ارجاعات در انتظار
            $query->where('status', 'pending');
        }
        
        // فیلتر بر اساس نوع اقدام
        if ($request->has('action_type') && $request->action_type) {
            $query->where('action_type', $request->action_type);
        }
        
        // فیلتر بر اساس اولویت
        if ($request->has('priority') && $request->priority) {
            $query->whereHas('letter', function ($q) use ($request) {
                $q->where('priority', $request->priority);
            });
        }
        
        // فیلتر تأخیر دار
        if ($request->has('overdue') && $request->overdue) {
            $query->where('deadline', '<', now())
                  ->where('status', 'pending');
        }
        
        // مرتب‌سازی
        $query->orderByRaw("CASE WHEN deadline < NOW() THEN 0 ELSE 1 END")
              ->orderBy('deadline', 'asc')
              ->orderBy('priority', 'desc');
        
        $routings = $query->paginate(15);
        
        // تبدیل تاریخ‌ها به شمسی برای نمایش
        $routings->getCollection()->transform(function ($routing) {
            if ($routing->deadline) {
                $routing->deadline_jalali = Jalalian::fromCarbon($routing->deadline)->format('Y/m/d');
                $routing->deadline_time = Jalalian::fromCarbon($routing->deadline)->format('H:i');
            }
            if ($routing->created_at) {
                $routing->created_at_jalali = Jalalian::fromCarbon($routing->created_at)->format('Y/m/d');
            }
            return $routing;
        });
        
        // ============================================
        // آمار کارتابل
        // ============================================
        
        $stats = [
            'total' => Routing::where(function ($q) use ($user) {
                    $q->where('to_user_id', $user->id)
                      ->orWhereIn('to_position_id', $user->positions()->pluck('id'));
                })
                ->where('status', 'pending')
                ->count(),
            
            'overdue' => Routing::where(function ($q) use ($user) {
                    $q->where('to_user_id', $user->id)
                      ->orWhereIn('to_position_id', $user->positions()->pluck('id'));
                })
                ->where('status', 'pending')
                ->where('deadline', '<', now())
                ->count(),
            
            'today' => Routing::where(function ($q) use ($user) {
                    $q->where('to_user_id', $user->id)
                      ->orWhereIn('to_position_id', $user->positions()->pluck('id'));
                })
                ->where('status', 'pending')
                ->whereDate('deadline', now())
                ->count(),
            
            'completed_today' => Routing::where(function ($q) use ($user) {
                    $q->where('to_user_id', $user->id)
                      ->orWhereIn('to_position_id', $user->positions()->pluck('id'));
                })
                ->where('status', 'completed')
                ->whereDate('completed_at', now())
                ->count(),
        ];
        
        // انواع اقدامات برای فیلتر
        $actionTypes = [
            'action' => 'اقدام',
            'information' => 'اطلاع',
            'approval' => 'تأیید',
            'coordination' => 'هماهنگی',
            'sign' => 'امضاء',
        ];
        
        // اولویت‌ها برای فیلتر
        $priorities = [
            'low' => 'کم',
            'normal' => 'عادی',
            'high' => 'مهم',
            'urgent' => 'فوری',
            'very_urgent' => 'خیلی فوری',
        ];
        
        return Inertia::render('cartable/index', [
            'routings' => $routings,
            'stats' => $stats,
            'actionTypes' => $actionTypes,
            'priorities' => $priorities,
            'filters' => $request->only(['status', 'action_type', 'priority', 'overdue']),
        ]);
    }
    
    /**
     * تکمیل اقدام
     */
    public function complete(Request $request, Routing $routing)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if ($routing->to_user_id !== $user->id && 
            !in_array($routing->to_position_id, $user->positions()->pluck('id')->toArray())) {
            return response()->json(['message' => 'شما دسترسی به این اقدام ندارید.'], 403);
        }
        
        // بررسی وضعیت
        if ($routing->status !== 'pending') {
            return response()->json(['message' => 'این اقدام قبلاً تکمیل شده است.'], 400);
        }
        
        $request->validate([
            'note' => 'nullable|string|max:500',
        ]);
        
        // تکمیل اقدام
        $routing->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completed_note' => $request->note,
        ]);
        
        // ثبت در تاریخچه
        \App\Models\Action::create([
            'routing_id' => $routing->id,
            'user_id' => $user->id,
            'action_type' => 'complete',
            'description' => $request->note ?? 'اقدام انجام شد',
            'ip_address' => $request->ip(),
        ]);
        
        // بروزرسانی وضعیت نامه اگر همه اقدامات تکمیل شده باشند
        $pendingCount = Routing::where('letter_id', $routing->letter_id)
            ->where('status', 'pending')
            ->count();
        
        if ($pendingCount === 0 && $routing->letter->final_status === 'pending') {
            $routing->letter->update(['final_status' => 'approved']);
        }
        
        return redirect()->back()->with('success', 'اقدام با موفقیت تکمیل شد.');
    }
    
    /**
     * رد اقدام
     */
    public function reject(Request $request, Routing $routing)
    {
        $user = auth()->user();
        
        // بررسی دسترسی
        if ($routing->to_user_id !== $user->id) {
            return response()->json(['message' => 'شما دسترسی به این اقدام ندارید.'], 403);
        }
        
        // بررسی وضعیت
        if ($routing->status !== 'pending') {
            return response()->json(['message' => 'این اقدام قبلاً تکمیل یا رد شده است.'], 400);
        }
        
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);
        
        // رد اقدام
        $routing->update([
            'status' => 'rejected',
            'completed_at' => now(),
            'completed_note' => $request->reason,
        ]);
        
        // ثبت در تاریخچه
        \App\Models\Action::create([
            'routing_id' => $routing->id,
            'user_id' => $user->id,
            'action_type' => 'reject',
            'description' => $request->reason,
            'ip_address' => $request->ip(),
        ]);
        
        // بروزرسانی وضعیت نامه
        $routing->letter->update(['final_status' => 'rejected']);
        
        return redirect()->back()->with('success', 'اقدام با موفقیت رد شد.');
    }
}