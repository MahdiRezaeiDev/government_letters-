<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Position;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        // $this->authorize('user.manage');

        $users = User::where('organization_id', auth()->user()->organization_id)
            ->with(['activePosition.department'])
            ->withCount('positionHistory')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        // $this->authorize('user.manage');

        $orgId = auth()->user()->organization_id;

        return Inertia::render('Admin/Users/Create', [
            'roles'     => Role::all(['id', 'name']),
            'positions' => Position::whereHas('department', fn($q) =>
                               $q->where('organization_id', $orgId))
                               ->with('department:id,name')
                               ->get(['id', 'name', 'department_id']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('user.manage');

        $validated = $request->validate([
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'username'      => 'required|string|unique:users',
            'email'         => 'required|email|unique:users',
            'password'      => 'required|min:8',
            'national_code' => 'nullable|string|size:10|unique:users',
            'mobile'        => 'nullable|string|max:20',
            'role'          => 'required|exists:roles,name',
            'position_id'   => 'required|exists:positions,id',
            'status'        => 'required|in:active,inactive,suspended',
        ]);

        $user = User::create([
            'organization_id' => auth()->user()->organization_id,
            'first_name'      => $validated['first_name'],
            'last_name'       => $validated['last_name'],
            'username'        => $validated['username'],
            'email'           => $validated['email'],
            'password'        => bcrypt($validated['password']),
            'national_code'   => $validated['national_code'],
            'mobile'          => $validated['mobile'],
            'status'          => $validated['status'],
        ]);

        // نقش
        $user->assignRole($validated['role']);

        // سمت
        UserPosition::create([
            'user_id'     => $user->id,
            'position_id' => $validated['position_id'],
            'start_date'  => now(),
            'status'      => 'active',
        ]);

        return redirect()->route('admin.users.index')
                         ->with('success', 'کاربر ایجاد شد');
    }

    public function edit(User $user)
    {
        $this->authorize('user.manage');

        $orgId = auth()->user()->organization_id;

        return Inertia::render('Admin/Users/Edit', [
            'user'      => $user->load('activePosition'),
            'roles'     => Role::all(['id', 'name']),
            'userRoles' => $user->getRoleNames(),
            'positions' => Position::whereHas('department', fn($q) =>
                               $q->where('organization_id', $orgId))
                               ->with('department:id,name')
                               ->get(['id', 'name', 'department_id']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('user.manage');

        $validated = $request->validate([
            'first_name'  => 'required|string|max:255',
            'last_name'   => 'required|string|max:255',
            'mobile'      => 'nullable|string|max:20',
            'status'      => 'required|in:active,inactive,suspended',
            'role'        => 'required|exists:roles,name',
            'position_id' => 'required|exists:positions,id',
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'mobile'     => $validated['mobile'],
            'status'     => $validated['status'],
        ]);

        // آپدیت نقش
        $user->syncRoles([$validated['role']]);

        // اگه سمت عوض شد
        $currentPosition = $user->activePosition;
        if (!$currentPosition || $currentPosition->id != $validated['position_id']) {
            // سمت قدیمی رو غیرفعال کن
            UserPosition::where('user_id', $user->id)
                        ->where('status', 'active')
                        ->update(['status' => 'inactive', 'end_date' => now()]);

            // سمت جدید
            UserPosition::create([
                'user_id'     => $user->id,
                'position_id' => $validated['position_id'],
                'start_date'  => now(),
                'status'      => 'active',
            ]);
        }

        return redirect()->route('admin.users.index')
                         ->with('success', 'کاربر آپدیت شد');
    }

    public function destroy(User $user)
    {
        $this->authorize('user.manage');

        // نمیشه خودت رو حذف کنی
        if ($user->id === auth()->id()) {
            return back()->with('error', 'نمی‌توانید خودتان را حذف کنید');
        }

        $user->delete();

        return back()->with('success', 'کاربر حذف شد');
    }
}