<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Letter;
use App\Models\Routing;
use App\Models\User;
use App\Support\AfghanCalendar;
use Illuminate\Support\Collection;

class ReceptionService
{
    /**
     * ریاست‌های ریشه‌ای که کاربر دبیرخانه آن‌هاست
     */
    public function getManagedRootDepartments(User $user): Collection
    {
        return Department::where('reception_user_id', $user->id)
            ->whereNull('parent_id')
            ->with('organization:id,name')
            ->get(['id', 'name', 'code', 'organization_id']);
    }

    /**
     * شناسه تمام واحدهای زیرمجموعه ریاست‌های تحت مدیریت
     */
    public function getManagedDepartmentIds(Collection $rootDepartments): array
    {
        return $rootDepartments
            ->flatMap(fn (Department $dept) => $dept->getDescendantIds())
            ->unique()
            ->values()
            ->all();
    }

    /**
     * آمار کلی دبیرخانه و ریاست
     */
    public function buildStats(User $user, Collection $rootDepartments, array $departmentIds): array
    {
        $receptionBase = Routing::where('to_user_id', $user->id)->where('is_reception', true);

        $incomingBase = Letter::query()
            ->where('is_draft', false)
            ->whereNull('reply_to_letter_id')
            ->whereIn('recipient_department_id', $departmentIds);

        $repliesBase = Letter::query()
            ->where('is_draft', false)
            ->whereNotNull('reply_to_letter_id')
            ->whereHas('replyTo', fn ($q) => $q->whereIn('recipient_department_id', $departmentIds));

        return [
            'reception' => [
                'total_received'   => (clone $receptionBase)->count(),
                'pending'          => (clone $receptionBase)->where('status', 'pending')->count(),
                'forwarded'        => (clone $receptionBase)->where('status', 'completed')->count(),
                'rejected'         => (clone $receptionBase)->where('status', 'rejected')->count(),
                'today_received'   => (clone $receptionBase)->whereDate('created_at', today())->count(),
                'week_received'    => (clone $receptionBase)->where('created_at', '>=', now()->startOfWeek())->count(),
                'month_received'   => (clone $receptionBase)->where('created_at', '>=', now()->startOfMonth())->count(),
                'month_forwarded'  => (clone $receptionBase)
                    ->where('status', 'completed')
                    ->where('completed_at', '>=', now()->startOfMonth())
                    ->count(),
            ],
            'department' => [
                'total_incoming'   => (clone $incomingBase)->count(),
                'total_replies'    => (clone $repliesBase)->count(),
                'replies_today'    => (clone $repliesBase)->whereDate('created_at', today())->count(),
                'replies_this_week'=> (clone $repliesBase)->where('created_at', '>=', now()->startOfWeek())->count(),
                'replies_this_month'=> (clone $repliesBase)->where('created_at', '>=', now()->startOfMonth())->count(),
                'incoming_today'   => (clone $incomingBase)->whereDate('created_at', today())->count(),
                'incoming_this_month'=> (clone $incomingBase)->where('created_at', '>=', now()->startOfMonth())->count(),
            ],
        ];
    }

    /**
     * آمار تفکیک‌شده به ازای هر ریاست
     */
    public function buildDepartmentBreakdown(User $user, Collection $rootDepartments): array
    {
        return $rootDepartments->map(function (Department $root) use ($user) {
            $deptIds = $root->getDescendantIds();

            $receptionBase = Routing::where('to_user_id', $user->id)
                ->where('is_reception', true)
                ->whereHas('letter', fn ($q) => $q->whereIn('recipient_department_id', $deptIds));

            $incomingCount = Letter::where('is_draft', false)
                ->whereNull('reply_to_letter_id')
                ->whereIn('recipient_department_id', $deptIds)
                ->count();

            $repliesCount = Letter::where('is_draft', false)
                ->whereNotNull('reply_to_letter_id')
                ->whereHas('replyTo', fn ($q) => $q->whereIn('recipient_department_id', $deptIds))
                ->count();

            return [
                'id'               => $root->id,
                'name'             => $root->name,
                'code'             => $root->code,
                'organization'     => $root->organization?->name,
                'received'         => (clone $receptionBase)->count(),
                'pending'          => (clone $receptionBase)->where('status', 'pending')->count(),
                'forwarded'        => (clone $receptionBase)->where('status', 'completed')->count(),
                'incoming_letters' => $incomingCount,
                'replies'          => $repliesCount,
            ];
        })->values()->all();
    }

    /**
     * آمار ماهانه ۶ ماه اخیر
     */
    public function buildMonthlyTrend(array $departmentIds): array
    {
        $since = now()->subMonths(5)->startOfMonth();

        $incoming = Letter::query()
            ->where('is_draft', false)
            ->whereNull('reply_to_letter_id')
            ->whereIn('recipient_department_id', $departmentIds)
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month');

        $replies = Letter::query()
            ->where('is_draft', false)
            ->whereNotNull('reply_to_letter_id')
            ->whereHas('replyTo', fn ($q) => $q->whereIn('recipient_department_id', $departmentIds))
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month');

        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $key = now()->subMonths($i)->format('Y-m');
            $months[] = [
                'month'    => $key,
                'label'    => AfghanCalendar::labelFromGregorianMonthKey($key),
                'incoming' => (int) ($incoming[$key] ?? 0),
                'replies'  => (int) ($replies[$key] ?? 0),
            ];
        }

        return $months;
    }

    public function getPendingRoutings(User $user, int $limit = 10): Collection
    {
        return Routing::where('to_user_id', $user->id)
            ->where('is_reception', true)
            ->where('status', 'pending')
            ->with([
                'letter:id,subject,letter_number,priority,recipient_department_id,created_at',
                'letter.recipientDepartment:id,name',
                'fromUser:id,first_name,last_name',
            ])
            ->orderBy('created_at')
            ->limit($limit)
            ->get();
    }

    public function getRecentForwarded(User $user, int $limit = 10): Collection
    {
        return Routing::where('to_user_id', $user->id)
            ->where('is_reception', true)
            ->where('status', 'completed')
            ->with([
                'letter:id,subject,letter_number,priority,recipient_department_id,recipient_user_id',
                'letter.recipientDepartment:id,name',
                'letter.recipientUser:id,first_name,last_name',
                'fromUser:id,first_name,last_name',
            ])
            ->latest('completed_at')
            ->limit($limit)
            ->get();
    }

    public function getRecentReplies(array $departmentIds, int $limit = 10): Collection
    {
        return Letter::query()
            ->where('is_draft', false)
            ->whereNotNull('reply_to_letter_id')
            ->whereHas('replyTo', fn ($q) => $q->whereIn('recipient_department_id', $departmentIds))
            ->with([
                'replyTo:id,subject,letter_number,recipient_department_id',
                'replyTo.recipientDepartment:id,name',
                'senderUser:id,first_name,last_name',
            ])
            ->latest()
            ->limit($limit)
            ->get(['id', 'subject', 'letter_number', 'reply_to_letter_id', 'sender_user_id', 'created_at']);
    }
}
