<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'super-admin';
    case ORG_ADMIN = 'org-admin';
    case DEPT_MANAGER = 'dept-manager';
    case USER = 'user';

    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'ادمین کل',
            self::ORG_ADMIN => 'ادمین وزارت',
            self::DEPT_MANAGER => 'ادمین ریاست',
            self::USER => 'کاربر عادی',
        };
    }
}