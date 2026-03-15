<?php

namespace App\Policies;

use App\Models\Letter;
use App\Models\User;

class LetterPolicy
{
    /**
     * بررسی دسترسی مشاهده نامه
     */
    public function view(User $user, Letter $letter): bool
    {
        // ادمین می‌تواند همه نامه‌ها را ببیند
        if ($user->hasRole('admin')) return true;

        // نامه باید متعلق به سازمان کاربر باشد
        return $user->organization_id === $letter->organization_id;
    }

    /**
     * بررسی دسترسی ویرایش
     */
    public function update(User $user, Letter $letter): bool
    {
        if ($user->hasRole('admin')) return true;

        // فقط در صورتی که نامه هنوز پیش‌نویس باشد یا توسط همین کاربر ثبت شده باشد
        return $user->organization_id === $letter->organization_id
            && ($letter->created_by === $user->id || $user->hasRole('manager'));
    }

    /**
     * بررسی دسترسی حذف
     */
    public function delete(User $user, Letter $letter): bool
    {
        if ($user->hasRole('admin')) return true;

        return $letter->created_by === $user->id && $letter->is_draft;
    }
}
