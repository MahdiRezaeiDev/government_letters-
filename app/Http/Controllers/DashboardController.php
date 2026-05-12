<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\User;
use App\Models\Department;
use App\Models\Routing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // آمار کلی
        $stats = [
            'pending_actions' => Routing::where('to_user_id', $user->id)
                ->where('status', 'pending')
                ->count(),

            'incoming_new' => Letter::where('recipient_user_id', $user->id)
                ->where('final_status', 'pending')
                ->where('letter_type', 'incoming')
                ->count(),

            'outgoing_new' => Letter::where('sender_user_id', $user->id)
                ->where('final_status', 'pending')
                ->where('letter_type', 'outgoing')
                ->count(),

            'my_drafts' => Letter::where('created_by', $user->id)
                ->where('is_draft', true)
                ->count(),

            'total_letters' => $this->getTotalLetters($user),
            'total_users' => $this->getTotalUsers($user),
            'total_departments' => $this->getTotalDepartments($user),
            'archived_count' => $this->getArchivedCount($user),
        ];

        // نامه‌های اخیر (دیتای واقعی)
        $recentLetters = Letter::query()
            ->when(!$user->isSuperAdmin(), function ($query) use ($user) {
                if ($user->isOrgAdmin()) {
                    $query->where('organization_id', $user->organization_id);
                } elseif ($user->isDeptManager()) {
                    $query->where(function ($q) use ($user) {
                        $q->where('sender_department_id', $user->department_id)
                            ->orWhere('recipient_department_id', $user->department_id);
                    });
                } else {
                    $query->where('created_by', $user->id);
                }
            })
            ->with(['category', 'senderDepartment', 'recipientDepartment'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($letter) => [
                'id' => $letter->id,
                'subject' => $letter->subject,
                'letter_number' => $letter->letter_number,
                'priority' => $letter->priority,
                'final_status' => $letter->final_status,
                'created_at' => $letter->created_at,
            ]);

        // آمار ماهانه (دیتای واقعی برای نمودار)
        $monthlyStats = Letter::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->when(!$user->isSuperAdmin(), function ($query) use ($user) {
                if ($user->isOrgAdmin()) {
                    $query->where('organization_id', $user->organization_id);
                } elseif ($user->isDeptManager()) {
                    $query->where(function ($q) use ($user) {
                        $q->where('sender_department_id', $user->department_id)
                            ->orWhere('recipient_department_id', $user->department_id);
                    });
                } else {
                    $query->where('created_by', $user->id);
                }
            })
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($item) => [
                'month' => $this->getPersianMonthName($item->month),
                'count' => $item->count,
            ]);

        // توزیع اولویت‌ها (دیتای واقعی برای نمودار دایره‌ای)
        $priorities = Letter::select('priority', DB::raw('COUNT(*) as count'))
            ->when(!$user->isSuperAdmin(), function ($query) use ($user) {
                if ($user->isOrgAdmin()) {
                    $query->where('organization_id', $user->organization_id);
                } elseif ($user->isDeptManager()) {
                    $query->where(function ($q) use ($user) {
                        $q->where('sender_department_id', $user->department_id)
                            ->orWhere('recipient_department_id', $user->department_id);
                    });
                } else {
                    $query->where('created_by', $user->id);
                }
            })
            ->groupBy('priority')
            ->get();

        $priorityDistribution = [
            ['name' => 'فوری', 'value' => 0, 'color' => '#ef4444'],
            ['name' => 'مهم', 'value' => 0, 'color' => '#f59e0b'],
            ['name' => 'عادی', 'value' => 0, 'color' => '#3b82f6'],
            ['name' => 'کم', 'value' => 0, 'color' => '#8b5cf6'],
        ];

        foreach ($priorities as $priority) {
            $index = array_search($this->getPriorityName($priority->priority), array_column($priorityDistribution, 'name'));
            if ($index !== false) {
                $priorityDistribution[$index]['value'] = $priority->count;
            }
        }

        // نوتیفیکیشن‌های واقعی (از جدول notifications)
        $notifications = $user->notifications()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($notification) => [
                'time' => $notification->created_at->format('H:i'),
                'msg' => $notification->data['message'] ?? 'نوتیفیکیشن جدید',
                'icon' => $this->getNotificationIcon($notification->type),
                'color' => $this->getNotificationColor($notification->type),
                'dot' => $this->getNotificationDotColor($notification->type),
            ]);

        $collection = collect([
            ['user_id' => 1, 'name' => 'علی'],
            ['user_id' => 2, 'name' => 'رضا'],
            ['user_id' => 3, 'name' => 'احمد'],
        ]);

        $collapsed = $collection->collapse();

        dd($collapsed);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentLetters' => $recentLetters,
            'monthlyStats' => $monthlyStats,
            'priorityDistribution' => $priorityDistribution,
            'notifications' => $notifications,
        ]);
    }

    private function getPersianMonthName($month): string
    {
        $months = [
            1 => 'حمل',
            2 => 'ثور',
            3 => 'جوزا',
            4 => 'سرطان',
            5 => 'اسد',
            6 => 'سنبله',
            7 => 'میزان',
            8 => 'عقرب',
            9 => 'قوس',
            10 => 'جدی',
            11 => 'دلو',
            12 => 'حوت'
        ];
        return $months[$month] ?? '';
    }

    private function getPriorityName($priority): string
    {
        return match ($priority) {
            'urgent' => 'فوری',
            'high' => 'مهم',
            'normal' => 'عادی',
            'low' => 'کم',
            default => 'عادی'
        };
    }

    private function getNotificationIcon($type): string
    {
        // بر اساس نوع نوتیفیکیشن آیکون مناسب برگردانید
        return 'Bell'; // یا آیکون مناسب دیگر
    }

    private function getNotificationColor($type): string
    {
        return match ($type) {
            'App\Notifications\LetterRepliedNotification' => 'text-emerald-500',
            default => 'text-indigo-500'
        };
    }

    private function getNotificationDotColor($type): string
    {
        return match ($type) {
            'App\Notifications\LetterRepliedNotification' => 'bg-emerald-500',
            default => 'bg-indigo-500'
        };
    }

    private function getTotalLetters($user): int
    {
        $query = Letter::query();

        if ($user->isSuperAdmin()) {
            return $query->count();
        }

        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }

        if ($user->isDeptManager()) {
            return $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                    ->orWhere('recipient_department_id', $user->department_id);
            })->count();
        }

        return $query->where('created_by', $user->id)->count();
    }

    private function getTotalUsers($user): int
    {
        $query = User::query();

        if ($user->isSuperAdmin()) {
            return $query->count();
        }

        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }

        if ($user->isDeptManager()) {
            return $query->where('department_id', $user->department_id)->count();
        }

        return 1; // فقط خودش
    }

    private function getTotalDepartments($user): int
    {
        $query = Department::query();

        if ($user->isSuperAdmin()) {
            return $query->count();
        }

        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }

        if ($user->isDeptManager()) {
            return $query->where('id', $user->department_id)->count();
        }

        return 0;
    }

    private function getArchivedCount($user): int
    {
        $query = Letter::where('final_status', 'archived');

        if ($user->isSuperAdmin()) {
            return $query->count();
        }

        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }

        if ($user->isDeptManager()) {
            return $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                    ->orWhere('recipient_department_id', $user->department_id);
            })->count();
        }

        return $query->where('created_by', $user->id)->count();
    }
}
