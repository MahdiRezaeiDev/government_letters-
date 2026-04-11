<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $currentUser): bool
    {
        return true;
    }
    
    public function view(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->isSuperAdmin()) return true;
        if ($currentUser->isOrgAdmin()) {
            return $currentUser->organization_id === $targetUser->organization_id;
        }
        if ($currentUser->isDeptManager()) {
            return $currentUser->department_id === $targetUser->department_id;
        }
        return $currentUser->id === $targetUser->id;
    }
    
    public function create(User $currentUser, ?int $organizationId = null): bool
    {
        if ($currentUser->isSuperAdmin()) return true;
        if ($currentUser->isOrgAdmin()) {
            return $currentUser->organization_id === $organizationId;
        }
        return false;
    }
    
    public function update(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->isSuperAdmin()) return true;
        if ($currentUser->isOrgAdmin()) {
            return $currentUser->organization_id === $targetUser->organization_id;
        }
        if ($currentUser->isDeptManager()) {
            return $currentUser->department_id === $targetUser->department_id;
        }
        return $currentUser->id === $targetUser->id;
    }
    
    public function delete(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->isSuperAdmin()) return true;
        if ($currentUser->isOrgAdmin()) {
            return $currentUser->organization_id === $targetUser->organization_id 
                   && $currentUser->id !== $targetUser->id;
        }
        return false;
    }
    
    public function assignRole(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->isSuperAdmin()) return true;
        if ($currentUser->isOrgAdmin()) {
            return $currentUser->organization_id === $targetUser->organization_id;
        }
        return false;
    }
}