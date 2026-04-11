<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Organization;

class OrganizationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin();
    }
    
    public function view(User $user, Organization $organization): bool
    {
        return $user->isSuperAdmin();
    }
    
    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }
    
    public function update(User $user, Organization $organization): bool
    {
        return $user->isSuperAdmin();
    }
    
    public function delete(User $user, Organization $organization): bool
    {
        // ادمین کل می‌تواند حذف کند، اما نمی‌تواند سازمان خودش را حذف کند
        if (!$user->isSuperAdmin()) {
            return false;
        }
        
        // جلوگیری از حذف سازمانی که کاربر ادمین دارد
        if ($organization->users()->whereHas('roles', function ($q) {
            $q->where('name', 'org-admin');
        })->exists()) {
            return false;
        }
        
        return true;
    }
}