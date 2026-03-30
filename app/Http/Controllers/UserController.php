<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\RolePermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly RolePermissionService $roleService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('user.view');

        $users = $this->userRepository->all($request->only([
            'search', 'status', 'organization_id', 'role', 'per_page',
        ]));

        return Inertia::render('Users/Index', [
            'users'   => UserResource::collection($users),
            'filters' => $request->only(['search', 'status', 'role']),
            'roles'   => \Spatie\Permission\Models\Role::select('id', 'name')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('user.create');

        return Inertia::render('Users/Create', [
            'roles'         => \Spatie\Permission\Models\Role::all(),
            'organizations' => \App\Models\Organization::active()->get(['id', 'name']),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorize('user.create');

        $user = $this->userRepository->create($request->validated());

        return redirect()
            ->route('users.show', $user)
            ->with('success', 'کاربر با موفقیت ایجاد شد');
    }

    public function show(int $id): Response
    {
        $this->authorize('user.view');

        $user = $this->userRepository->findById($id);

        return Inertia::render('Users/Show', [
            'user' => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, int $id)
    {
        $this->authorize('user.edit');

        $user = $this->userRepository->update($id, $request->validated());

        return back()->with('success', 'کاربر با موفقیت بروزرسانی شد');
    }

    public function destroy(int $id)
    {
        $this->authorize('user.delete');

        $this->userRepository->delete($id);

        return redirect()
            ->route('users.index')
            ->with('success', 'کاربر با موفقیت حذف شد');
    }

    public function assignPosition(Request $request, int $userId)
    {
        $this->authorize('user.edit');

        $request->validate([
            'position_id' => 'required|exists:positions,id',
            'is_primary'  => 'boolean',
            'start_date'  => 'required|date',
        ]);

        $this->userRepository->assignPosition($userId, $request->position_id, [
            'is_primary' => $request->is_primary ?? false,
            'start_date' => $request->start_date,
        ]);

        return back()->with('success', 'سمت با موفقیت انتساب یافت');
    }
}