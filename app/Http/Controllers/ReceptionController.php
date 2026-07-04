<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use App\Services\ReceptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceptionController extends Controller
{
    public function __construct(protected ReceptionService $receptionService) {}

    /**
     * داشبورد دبیرخانه — آمار نامه‌های دریافتی و پاسخ‌های ریاست
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $managedDepartments = $this->receptionService->getManagedRootDepartments($user);

        if ($managedDepartments->isEmpty()) {
            abort(403, 'شما به عنوان دبیرخانه تعیین نشده‌اید.');
        }

        $departmentIds = $this->receptionService->getManagedDepartmentIds($managedDepartments);

        return Inertia::render('reception/index', [
            'managedDepartments'   => $managedDepartments,
            'stats'                => $this->receptionService->buildStats($user, $managedDepartments, $departmentIds),
            'departmentBreakdown'  => $this->receptionService->buildDepartmentBreakdown($user, $managedDepartments),
            'monthlyTrend'         => $this->receptionService->buildMonthlyTrend($departmentIds),
            'pendingRoutings'      => $this->receptionService->getPendingRoutings($user),
            'recentForwarded'      => $this->receptionService->getRecentForwarded($user),
            'recentReplies'        => $this->receptionService->getRecentReplies($departmentIds),
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
                'id'            => $u->id,
                'name'          => $u->full_name,
                'department'    => $u->department?->name,
                'department_id' => $u->department_id,
                'position'      => $u->primaryPosition?->name,
                'position_id'   => $u->primary_position_id,
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
