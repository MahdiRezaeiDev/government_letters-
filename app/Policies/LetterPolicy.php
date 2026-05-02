<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Letter;
use App\Models\User;

class LetterPolicy
{
    // ─── Helper: آیا این نامه به کاربر مربوط است؟ ──────────────────────────
    private function owns(User $user, Letter $letter): bool
    {
        return $letter->created_by        === $user->id
            || $letter->sender_user_id    === $user->id
            || $letter->recipient_user_id === $user->id
            || $letter->routings()->where('to_user_id', $user->id)->exists();
    }

    // ─── CRUD پایه ──────────────────────────────────────────────────────────

    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::VIEW_LETTERS->value);
    }

    public function view(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::VIEW_LETTERS->value)
            && $this->owns($user, $letter);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::CREATE_LETTER->value);
    }

    public function update(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::EDIT_LETTER->value)
            && $letter->created_by    === $user->id   // فقط نویسنده
            && $letter->final_status  === 'draft';     // فقط پیش‌نویس
    }

    public function delete(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::DELETE_LETTER->value)
            && $letter->created_by === $user->id;
    }

    public function restore(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::DELETE_LETTER->value)
            && $letter->created_by === $user->id;
    }

    public function forceDelete(User $user, Letter $letter): bool
    {
        return false; // هیچ‌کس مجاز نیست
    }

    // ─── عملیات اختصاصی نامه ────────────────────────────────────────────────

    public function archive(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::ARCHIVE_LETTER->value)
            && $this->owns($user, $letter)
            && $letter->final_status === 'approved';
    }

    public function route(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::ROUTE_LETTER->value)
            && $this->owns($user, $letter)
            && $letter->final_status === 'pending';
    }

    public function approve(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::APPROVE_LETTER->value)
            && $letter->final_status === 'pending'
            // فقط کسی که نامه *الان* نزد اوست تأیید کند
            && $letter->routings()
            ->where('to_user_id', $user->id)
            ->where('status', 'pending')
            ->exists();
    }

    public function sign(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::SIGN_LETTER->value)
            && $this->owns($user, $letter);
    }
}
