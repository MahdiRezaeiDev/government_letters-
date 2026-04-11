// app/Policies/PositionPolicy.php

<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Position;

class PositionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }
    
    public function view(User $user, Position $position): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $position->department->organization_id;
        }
        return false;
    }
    
    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isOrgAdmin();
    }
    
    public function update(User $user, Position $position): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $position->department->organization_id;
        }
        return false;
    }
    
    public function delete(User $user, Position $position): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $position->department->organization_id;
        }
        return false;
    }
}