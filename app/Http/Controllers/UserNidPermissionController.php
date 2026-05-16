<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Enums\PermissionEnum;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class UserPermissionController extends Controller
{
    // نمایش فرم مدیریت دسترسی‌های مستقیم (React view)
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Permissions', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name
                ]),
                'permissions' => $user->getAllPermissionsForFrontend(),
            ],
            'allPermissions' => PermissionEnum::cases(),
            'groupedPermissions' => $this->getGroupedPermissions(),
        ]);
    }

    // بروزرسانی دسترسی‌های مستقیم
    public function update(User $user)
    {
        $permissions = request()->input('permissions', []);

        // همگام‌سازی دسترسی‌های مستقیم
        $user->syncPermissions($permissions);

        return redirect()->back()->with('success', 'دسترسی‌ها با موفقیت بروزرسانی شد.');
    }

    // گروه‌بندی دسترسی‌ها برای نمایش بهتر در React
    private function getGroupedPermissions(): array
    {
        return [
            'سازمان‌ها' => [
                PermissionEnum::VIEW_ORGANIZATIONS->value => PermissionEnum::VIEW_ORGANIZATIONS->label(),
                PermissionEnum::CREATE_ORGANIZATION->value => PermissionEnum::CREATE_ORGANIZATION->label(),
                PermissionEnum::EDIT_ORGANIZATION->value => PermissionEnum::EDIT_ORGANIZATION->label(),
                PermissionEnum::DELETE_ORGANIZATION->value => PermissionEnum::DELETE_ORGANIZATION->label(),
            ],
            'دپارتمان‌ها' => [
                PermissionEnum::VIEW_DEPARTMENTS->value => PermissionEnum::VIEW_DEPARTMENTS->label(),
                PermissionEnum::CREATE_DEPARTMENT->value => PermissionEnum::CREATE_DEPARTMENT->label(),
                PermissionEnum::EDIT_DEPARTMENT->value => PermissionEnum::EDIT_DEPARTMENT->label(),
                PermissionEnum::DELETE_DEPARTMENT->value => PermissionEnum::DELETE_DEPARTMENT->label(),
            ],
            'کاربران' => [
                PermissionEnum::VIEW_USERS->value => PermissionEnum::VIEW_USERS->label(),
                PermissionEnum::CREATE_USER->value => PermissionEnum::CREATE_USER->label(),
                PermissionEnum::EDIT_USER->value => PermissionEnum::EDIT_USER->label(),
                PermissionEnum::DELETE_USER->value => PermissionEnum::DELETE_USER->label(),
                PermissionEnum::ASSIGN_ROLE->value => PermissionEnum::ASSIGN_ROLE->label(),
            ],
            'نامه‌ها' => [
                PermissionEnum::VIEW_LETTERS->value => PermissionEnum::VIEW_LETTERS->label(),
                PermissionEnum::CREATE_LETTER->value => PermissionEnum::CREATE_LETTER->label(),
                PermissionEnum::EDIT_LETTER->value => PermissionEnum::EDIT_LETTER->label(),
                PermissionEnum::DELETE_LETTER->value => PermissionEnum::DELETE_LETTER->label(),
                PermissionEnum::ARCHIVE_LETTER->value => PermissionEnum::ARCHIVE_LETTER->label(),
                PermissionEnum::ROUTE_LETTER->value => PermissionEnum::ROUTE_LETTER->label(),
                PermissionEnum::APPROVE_LETTER->value => PermissionEnum::APPROVE_LETTER->label(),
                PermissionEnum::SIGN_LETTER->value => PermissionEnum::SIGN_LETTER->label(),
                PermissionEnum::REPLY_LETTER->value => PermissionEnum::REPLY_LETTER->label(),
            ],
            'تذکره' => [
                PermissionEnum::NID_REGISTER->value => PermissionEnum::NID_REGISTER->label(),
                PermissionEnum::NID_APPROVE->value => PermissionEnum::NID_APPROVE->label(),
                PermissionEnum::NID_VIEW->value => PermissionEnum::NID_VIEW->label(),
                PermissionEnum::NID_DESTROY->value => PermissionEnum::NID_DESTROY->label(),
            ],
            // ... سایر گروه‌ها
        ];
    }
}
