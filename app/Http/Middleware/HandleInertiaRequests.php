<?php

namespace App\Http\Middleware;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? $this->sharedUser($user) : null,
                'isReceptionUser' => $user
                    ? Department::where('reception_user_id', $user->id)->exists()
                    : false,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Share auth user without mutating model attributes (avoids saving computed fields).
     */
    private function sharedUser($user): array
    {
        $user->loadMissing('roles');

        return [
            ...$user->toArray(),
            'roles' => $user->roles->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ])->values()->all(),
            'is_super_admin' => $user->isSuperAdmin(),
            'permissions' => [
                'all' => $user->getAllPermissions()->pluck('name')->values()->all(),
                'direct' => $user->getDirectPermissions()->pluck('name')->values()->all(),
                'via_roles' => $user->getPermissionsViaRoles()->pluck('name')->values()->all(),
            ],
        ];
    }
}
