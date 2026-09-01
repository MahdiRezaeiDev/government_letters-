<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PermissionEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserPermissionController extends Controller
{
    public function edit(User $user)
    {
        return Inertia::render('permissions/Permissions', [
            'user' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'roles' => $user->roles->map(fn ($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                ]),
                'permissions' => $user->getAllPermissionsForFrontend(),
            ],
            'allPermissions' => collect(PermissionEnum::cases())->map(fn (PermissionEnum $p) => [
                'name' => $p->value,
                'label' => $p->label(),
            ])->values(),
            'groupedPermissions' => $this->getGroupedPermissions(),
        ]);
    }

    public function update(User $user)
    {
        $permissions = request()->validate([
            'permissions' => 'array',
            'permissions.*' => 'string',
        ])['permissions'] ?? [];

        $user->syncPermissions($permissions);

        return redirect()
            ->route('admin.users.permissions.edit', $user)
            ->with('success', 'دسترسی‌ها با موفقیت بروزرسانی شد.');
    }

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
            'مکاتیب' => [
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
            'بایگانی و پرونده' => [
                PermissionEnum::VIEW_CASES->value => PermissionEnum::VIEW_CASES->label(),
                PermissionEnum::CREATE_CASE->value => PermissionEnum::CREATE_CASE->label(),
                PermissionEnum::EDIT_CASE->value => PermissionEnum::EDIT_CASE->label(),
                PermissionEnum::DELETE_CASE->value => PermissionEnum::DELETE_CASE->label(),
            ],
            'گزارشات' => [
                PermissionEnum::VIEW_REPORTS->value => PermissionEnum::VIEW_REPORTS->label(),
                PermissionEnum::EXPORT_REPORTS->value => PermissionEnum::EXPORT_REPORTS->label(),
            ],
            'بست‌های کاری' => [
                PermissionEnum::VIEW_POSITIONS->value => PermissionEnum::VIEW_POSITIONS->label(),
                PermissionEnum::CREATE_POSITION->value => PermissionEnum::CREATE_POSITION->label(),
                PermissionEnum::EDIT_POSITION->value => PermissionEnum::EDIT_POSITION->label(),
                PermissionEnum::DELETE_POSITION->value => PermissionEnum::DELETE_POSITION->label(),
            ],
            'دسته‌بندی‌ها' => [
                PermissionEnum::VIEW_CATEGORIES->value => PermissionEnum::VIEW_CATEGORIES->label(),
                PermissionEnum::CREATE_CATEGORY->value => PermissionEnum::CREATE_CATEGORY->label(),
                PermissionEnum::EDIT_CATEGORY->value => PermissionEnum::EDIT_CATEGORY->label(),
                PermissionEnum::DELETE_CATEGORY->value => PermissionEnum::DELETE_CATEGORY->label(),
            ],
            'تذکره' => [
                PermissionEnum::NID_REGISTER->value => PermissionEnum::NID_REGISTER->label(),
                PermissionEnum::NID_APPROVE->value => PermissionEnum::NID_APPROVE->label(),
                PermissionEnum::NID_VIEW->value => PermissionEnum::NID_VIEW->label(),
                PermissionEnum::NID_DESTROY->value => PermissionEnum::NID_DESTROY->label(),
            ],
        ];
    }
}
