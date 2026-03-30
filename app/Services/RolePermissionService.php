<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Collection;

class RolePermissionService
{
    // گروه‌بندی دسترسی‌ها
    private array $permissionGroups = [
        'organization' => [
            'organization.view', 'organization.create',
            'organization.edit', 'organization.delete',
        ],
        'department' => [
            'department.view', 'department.create',
            'department.edit', 'department.delete',
        ],
        'position' => [
            'position.view', 'position.create',
            'position.edit', 'position.delete',
        ],
        'user' => [
            'user.view', 'user.create', 'user.edit',
            'user.delete', 'user.assign-role',
        ],
        'letter' => [
            'letter.view', 'letter.create', 'letter.edit',
            'letter.delete', 'letter.send', 'letter.archive',
        ],
        'report' => [
            'report.view', 'report.export',
        ],
        'settings' => [
            'settings.view', 'settings.edit',
        ],
    ];

    public function seedPermissions(): void
    {
        foreach ($this->permissionGroups as $group => $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission],
                    ['guard_name' => 'web']
                );
            }
        }
    }

    public function getGroupedPermissions(): Collection
    {
        return Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });
    }

    public function createRole(string $name, array $permissions = []): Role
    {
        $role = Role::create(['name' => $name]);
        $role->syncPermissions($permissions);
        return $role;
    }

    public function syncRolePermissions(int $roleId, array $permissions): Role
    {
        $role = Role::findOrFail($roleId);
        $role->syncPermissions($permissions);
        return $role;
    }
}