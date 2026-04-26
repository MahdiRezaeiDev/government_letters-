<?php
// PermissionEnum.php - ثابت و مرجع اصلی

namespace App\Enums;

enum PermissionEnum: string
{
    // ============================================
    // مجوزهای سازمانی (فقط ادمین کل)
    // ============================================
    case VIEW_ORGANIZATIONS  = 'view-organizations';
    case CREATE_ORGANIZATION = 'create-organization';
    case EDIT_ORGANIZATION   = 'edit-organization';
    case DELETE_ORGANIZATION = 'delete-organization';

        // ============================================
        // مجوزهای دپارتمان
        // ============================================
    case VIEW_DEPARTMENTS  = 'view-departments';
    case CREATE_DEPARTMENT = 'create-department';
    case EDIT_DEPARTMENT   = 'edit-department';
    case DELETE_DEPARTMENT = 'delete-department';

        // ============================================
        // مجوزهای کاربری
        // ============================================
    case VIEW_USERS  = 'view-users';
    case CREATE_USER = 'create-user';
    case EDIT_USER   = 'edit-user';
    case DELETE_USER = 'delete-user';
    case ASSIGN_ROLE = 'assign-role';

        // ============================================
        // مجوزهای نامه
        // ============================================
    case VIEW_LETTERS    = 'view-letters';
    case CREATE_LETTER   = 'create-letter';
    case EDIT_LETTER     = 'edit-letter';
    case DELETE_LETTER   = 'delete-letter';
    case ARCHIVE_LETTER  = 'archive-letter';
    case ROUTE_LETTER    = 'route-letter';
    case APPROVE_LETTER  = 'approve-letter';
    case SIGN_LETTER     = 'sign-letter';

        // ============================================
        // مجوزهای بایگانی
        // ============================================
    case VIEW_CASES  = 'view-cases';
    case CREATE_CASE = 'create-case';
    case EDIT_CASE   = 'edit-case';
    case DELETE_CASE = 'delete-case';

        // ============================================
        // مجوزهای گزارشات
        // ============================================
    case VIEW_REPORTS   = 'view-reports';
    case EXPORT_REPORTS = 'export-reports';

        // ============================================
        // مجوزهای پست سازمانی
        // ============================================
    case VIEW_POSITIONS   = 'view-positions';
    case CREATE_POSITION  = 'create-position';
    case EDIT_POSITION    = 'edit-position';
    case DELETE_POSITION  = 'delete-position';

        // ============================================
        // مجوزهای دسته‌بندی نامه‌ها
        // ============================================
    case VIEW_CATEGORIES   = 'view-categories';
    case CREATE_CATEGORY   = 'create-category';
    case EDIT_CATEGORY     = 'edit-category';
    case DELETE_CATEGORY   = 'delete-category';

    // ============================================
    // متدهای کمکی
    // ============================================

    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * ادمین کل — دسترسی به همه چیز
     */
    public static function superAdminPermissions(): array
    {
        return self::all();
    }

    /**
     * ادمین سازمان — همه چیز مربوط به سازمان خودش
     * (بدون دسترسی به مدیریت سازمان‌ها که فقط برای ادمین کل است)
     */
    public static function orgAdminPermissions(): array
    {
        return [
            // دپارتمان
            self::VIEW_DEPARTMENTS->value,
            self::CREATE_DEPARTMENT->value,
            self::EDIT_DEPARTMENT->value,
            self::DELETE_DEPARTMENT->value,
            // کاربران
            self::VIEW_USERS->value,
            self::CREATE_USER->value,
            self::EDIT_USER->value,
            self::DELETE_USER->value,
            self::ASSIGN_ROLE->value,
            // نامه
            self::VIEW_LETTERS->value,
            self::CREATE_LETTER->value,
            self::EDIT_LETTER->value,
            self::DELETE_LETTER->value,
            self::ARCHIVE_LETTER->value,
            self::ROUTE_LETTER->value,
            self::APPROVE_LETTER->value,
            self::SIGN_LETTER->value,
            // بایگانی
            self::VIEW_CASES->value,
            self::CREATE_CASE->value,
            self::EDIT_CASE->value,
            self::DELETE_CASE->value,
            // گزارشات
            self::VIEW_REPORTS->value,
            self::EXPORT_REPORTS->value,
            self::VIEW_POSITIONS->value,
            self::CREATE_POSITION->value,
            self::EDIT_POSITION->value,
            self::DELETE_POSITION->value,

            self::VIEW_CATEGORIES->value,
            self::CREATE_CATEGORY->value,
            self::EDIT_CATEGORY->value,
            self::DELETE_CATEGORY->value,
        ];
    }

    /**
     * مدیر دپارتمان — فقط مشاهده، بدون ایجاد/ویرایش/حذف
     */
    public static function deptManagerPermissions(): array
    {
        return [
            self::VIEW_DEPARTMENTS->value,
            self::VIEW_USERS->value,
            self::VIEW_LETTERS->value,
            self::VIEW_CASES->value,
            self::VIEW_REPORTS->value,
            self::VIEW_POSITIONS->value,
            self::VIEW_CATEGORIES->value,
        ];
    }

    /**
     * کاربر عادی — فقط مشاهده نامه‌ها
     */
    public static function userPermissions(): array
    {
        return [
            self::VIEW_LETTERS->value,
        ];
    }

    public function label(): string
    {
        return match ($this) {
            self::VIEW_ORGANIZATIONS  => 'مشاهده سازمان‌ها',
            self::CREATE_ORGANIZATION => 'ایجاد سازمان',
            self::EDIT_ORGANIZATION   => 'ویرایش سازمان',
            self::DELETE_ORGANIZATION => 'حذف سازمان',

            self::VIEW_DEPARTMENTS  => 'مشاهده دپارتمان‌ها',
            self::CREATE_DEPARTMENT => 'ایجاد دپارتمان',
            self::EDIT_DEPARTMENT   => 'ویرایش دپارتمان',
            self::DELETE_DEPARTMENT => 'حذف دپارتمان',

            self::VIEW_USERS  => 'مشاهده کاربران',
            self::CREATE_USER => 'ایجاد کاربر',
            self::EDIT_USER   => 'ویرایش کاربر',
            self::DELETE_USER => 'حذف کاربر',
            self::ASSIGN_ROLE => 'تخصیص نقش',

            self::VIEW_LETTERS    => 'مشاهده نامه‌ها',
            self::CREATE_LETTER   => 'ایجاد نامه',
            self::EDIT_LETTER     => 'ویرایش نامه',
            self::DELETE_LETTER   => 'حذف نامه',
            self::ARCHIVE_LETTER  => 'بایگانی نامه',
            self::ROUTE_LETTER    => 'ارجاع نامه',
            self::APPROVE_LETTER  => 'تأیید نامه',
            self::SIGN_LETTER     => 'امضای نامه',

            self::VIEW_CASES  => 'مشاهده پرونده‌ها',
            self::CREATE_CASE => 'ایجاد پرونده',
            self::EDIT_CASE   => 'ویرایش پرونده',
            self::DELETE_CASE => 'حذف پرونده',

            self::VIEW_REPORTS   => 'مشاهده گزارشات',
            self::EXPORT_REPORTS => 'خروجی گزارشات',

            self::VIEW_POSITIONS   => 'مشاهده پست‌های سازمانی',
            self::CREATE_POSITION  => 'ایجاد پست سازمانی',
            self::EDIT_POSITION    => 'ویرایش پست سازمانی',
            self::DELETE_POSITION  => 'حذف پست سازمانی',

            self::VIEW_CATEGORIES   => 'مشاهده دسته‌بندی‌ها',
            self::CREATE_CATEGORY   => 'ایجاد دسته‌بندی',
            self::EDIT_CATEGORY     => 'ویرایش دسته‌بندی',
            self::DELETE_CATEGORY   => 'حذف دسته‌بندی',
        };
    }
}
