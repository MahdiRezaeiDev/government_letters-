<?php
// RolePermissionSeeder.php - همه چیز از PermissionEnum می‌خواند

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // ============================================
        // ایجاد همه مجوزها از روی Enum (منبع واحد)
        // ============================================
        foreach (PermissionEnum::all() as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ============================================
        // ایجاد نقش‌ها و تخصیص مجوزها
        // ============================================

        // 1. ادمین کل — همه مجوزها
        $superAdmin = Role::firstOrCreate(['name' => RoleEnum::SUPER_ADMIN->value]);
        $superAdmin->syncPermissions(PermissionEnum::superAdminPermissions());

        // 2. ادمین سازمان — همه چیز مربوط به سازمان خودش
        //    (Policy بعداً محدودیت سازمان را اعمال می‌کند)
        $orgAdmin = Role::firstOrCreate(['name' => RoleEnum::ORG_ADMIN->value]);
        $orgAdmin->syncPermissions(PermissionEnum::orgAdminPermissions());

        // 3. مدیر دپارتمان — فقط مشاهده
        $deptManager = Role::firstOrCreate(['name' => RoleEnum::DEPT_MANAGER->value]);
        $deptManager->syncPermissions(PermissionEnum::deptManagerPermissions());

        // 4. کاربر عادی — فقط مشاهده نامه‌ها
        $user = Role::firstOrCreate(['name' => RoleEnum::USER->value]);
        $user->syncPermissions(PermissionEnum::userPermissions());

        // ============================================
        // ایجاد کاربر ادمین کل پیش‌فرض
        // ============================================
        $superUser = User::firstOrCreate(
            ['email' => 'superadmin@system.com'],
            [
                'organization_id' => null,
                'password'        => bcrypt('password'),
                'first_name'      => 'مدیر',
                'last_name'       => 'کل',
                'national_code'   => '1111111111',
                'status'          => 'active',
            ]
        );
        $superUser->assignRole(RoleEnum::SUPER_ADMIN->value);
    }
}