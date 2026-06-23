<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Tazkira;
use App\Enums\PermissionEnum;

class TazkiraPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::NID_REGISTER) ||
            $user->can(PermissionEnum::NID_APPROVE) ||
            $user->can(PermissionEnum::NID_VIEW) ||
            $user->can(PermissionEnum::NID_DESTROY);
    }

    public function view(User $user, Tazkira $tazkira): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::NID_REGISTER);
    }

    public function update(User $user, Tazkira $tazkira): bool
    {
        return $user->id == $tazkira->created_by && $user->can(PermissionEnum::NID_REGISTER);
    }

    public function delete(User $user, Tazkira $tazkira): bool
    {
        return $user->can(PermissionEnum::NID_DESTROY);
    }

    public function approve(User $user, Tazkira $tazkira): bool
    {
        return $user->can(PermissionEnum::NID_APPROVE);
    }

    public function edit(User $user, Tazkira $tazkira): bool
    {
        return $this->update($user, $tazkira);
    }
}
