<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Department;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // همه می‌توانند لیست ببینند (کنترلر فیلتر می‌کند)
    }
    
    public function view(User $user, Department $department): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $department->organization_id;
        }
        return false;
    }
    
    public function create(User $user, ?int $organizationId = null): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $organizationId;
        }
        return false;
    }
    
    public function update(User $user, Department $department): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $department->organization_id;
        }
        return false;
    }
    
    public function delete(User $user, Department $department): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $department->organization_id;
        }
        return false;
    }
}