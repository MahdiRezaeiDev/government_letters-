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
            || $letter->delegations()->where('delegated_to_user_id', $user->id)->exists();
    }

    // ─── CRUD پایه ──────────────────────────────────────────────────────────

    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::VIEW_LETTERS->value);
    }

    public function view(User $user, Letter $letter): bool
    {
        if (!$user->can(PermissionEnum::VIEW_LETTERS->value)) {
            return false;
        }

        // سوپر ادمین می‌تواند همه نامه‌ها را ببیند
        if ($user->isSuperAdmin()) {
            return true;
        }

        // ادمین سازمان می‌تواند نامه‌های سازمان خود را ببیند
        if ($user->isOrgAdmin()) {
            return $letter->organization_id === $user->organization_id || $letter->recipient_organization_id  === $user->organization_id;
        }

        // مدیر دپارتمان می‌تواند نامه‌های دپارتمان خود را ببیند
        if ($user->isDeptManager()) {
            return $letter->sender_department_id === $user->department_id
                || $letter->recipient_department_id === $user->department_id
                || $this->owns($user, $letter);
        }

        // کاربر عادی: فقط نامه‌های مربوط به خودش
        return $this->owns($user, $letter);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::CREATE_LETTER->value);
    }

    public function update(User $user, Letter $letter): bool
    {
        return $user->can(PermissionEnum::EDIT_LETTER->value)
            && $letter->created_by    === $user->id
            && $letter->final_status  === 'draft';
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
        return false;
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

    public function reply(User $user, Letter $letter): bool
    {
        // کاربر باید مجوز پاسخ داشته باشد
        if (!$user->can(PermissionEnum::REPLY_LETTER->value)) {
            return false;
        }

        // نامه نباید پیش‌نویس باشد
        if ($letter->final_status === 'draft') {
            return false;
        }

        // نامه باید تأیید شده یا در انتظار باشد
        if (!in_array($letter->final_status, ['approved', 'pending'])) {
            return false;
        }

        if ($this->is_delegate($user, $letter) || $this->is_receiver($user, $letter)) {
            return true;
        }

        return false;
    }

    public function is_delegate(User $user, Letter $letter): bool
    {
        return $letter->delegations()->where('delegated_to_user_id', $user->id)->exists();
    }

    public function is_receiver(User $user, Letter $letter): bool
    {
        return $letter->recipient_user_id === $user->id;
    }

    public function delegate(User $user, Letter $letter): bool
    {
        // 1. فقط گیرنده اصلی می‌تواند ارجاع دهد
        if ($user->id !== $letter->recipient_user_id) {
            return false;
        }

        // 2. مکتوب نباید قبلاً ارجاع شده باشد
        if ($letter->delegated_to_user_id !== null) {
            return false;
        }

        // 3. مکتوب نباید در وضعیت پیش‌نویس باشد
        if ($letter->final_status === 'draft') {
            return false;
        }

        // 4. مکتوب نباید بایگانی شده باشد
        if ($letter->final_status === 'archived') {
            return false;
        }

        // 7. (اختیاری) بررسی کنید که آیا ارجاع فعال قبلی وجود دارد
        if ($letter->delegations()->whereIn('status', ['pending', 'accepted'])->exists()) {
            return false;
        }

        return true;
    }
}
