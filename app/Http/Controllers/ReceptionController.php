<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Letter;
use App\Models\Routing;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceptionController extends Controller
{
    /**
     * داشبورد دبیرخانه با آمار نامه‌ها
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $managedDepartments = Department::where('reception_user_id', $user->id)
            ->whereNull('parent_id')
            ->with('organization:id,name')
            ->get(['id', 'name', 'code', 'organization_id']);

        if ($managedDepartments->isEmpty()) {
            abort(403, 'شما به عنوان دبیرخانه تعیین نشده‌اید.');
        }

        $baseQuery = Routing::where('to_user_id', $user->id)->where('is_reception', true);

        $stats = [
            'total_received'  => (clone $baseQuery)->count(),
            'pending'         => (clone $baseQuery)->where('status', 'pending')->count(),
            'forwarded'       => (clone $baseQuery)->where('status', 'completed')->count(),
            'today_received'  => (clone $baseQuery)->whereDate('created_at', today())->count(),
            'replies'         => Letter::whereHas('routings', function ($q) use ($user) {
                $q->where('to_user_id', $user->id)
                    ->where('is_reception', true)
                    ->where('status', 'completed');
            })->whereHas('replies')->count(),
        ];

        $recentRoutings = Routing::where('to_user_id', $user->id)
            ->where('is_reception', true)
            ->with([
                'letter:id,subject,letter_number,priority,recipient_department_id',
                'letter.recipientDepartment:id,name',
                'fromUser:id,first_name,last_name',
            ])
            ->latest()
            ->limit(15)
            ->get();

        return Inertia::render('reception/index', [
            'managedDepartments' => $managedDepartments,
            'stats'              => $stats,
            'recentRoutings'     => $recentRoutings,
        ]);
    }

    /**
     * کاربران قابل ارجاع در درخت یک ریاست
     */
    public function departmentUsers(Department $department)
    {
        $user = auth()->user();
        $rootDepartment = $department->getRootDepartment();

        if ($rootDepartment->reception_user_id !== $user->id && !$user->isSuperAdmin() && !$user->isOrgAdmin()) {
            abort(403);
        }

        $departmentIds = $rootDepartment->getDescendantIds();

        $users = User::whereIn('department_id', $departmentIds)
            ->where('status', 'active')
            ->where('id', '!=', $rootDepartment->reception_user_id)
            ->with(['primaryPosition:id,name', 'department:id,name'])
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'department_id', 'primary_position_id'])
            ->map(fn (User $u) => [
                'id'           => $u->id,
                'name'         => $u->full_name,
                'department'   => $u->department?->name,
                'department_id'=> $u->department_id,
                'position'     => $u->primaryPosition?->name,
                'position_id'  => $u->primary_position_id,
            ]);

        $departments = Department::whereIn('id', $departmentIds)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        return response()->json([
            'users'       => $users,
            'departments' => $departments,
        ]);
    }
}
