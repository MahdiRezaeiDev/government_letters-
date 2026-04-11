<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // پاک کردن کش قبلی
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // ============================================
        // تعریف مجوزها (Permissions)
        // ============================================
        
        // مجوزهای مدیریت سازمان (فقط برای ادمین کل)
        $orgPermissions = [
            'create-organization',
            'edit-organization',
            'delete-organization',
            'view-all-organizations',
        ];
        
        // مجوزهای مدیریت دپارتمان
        $deptPermissions = [
            'create-department',
            'edit-department',
            'delete-department',
            'view-department',
        ];
        
        // مجوزهای مدیریت کاربران در سازمان
        $userPermissions = [
            'create-user-in-org',
            'edit-user-in-org',
            'delete-user-in-org',
            'view-users-in-org',
            'assign-role-to-user',
        ];
        
        // مجوزهای مدیریت نامه‌ها
        $letterPermissions = [
            'create-letter',
            'edit-letter',
            'delete-letter',
            'view-letter',
            'archive-letter',
            'sign-letter',
            'route-letter',
        ];
        
        // ایجاد همه مجوزها
        $allPermissions = array_merge(
            $orgPermissions,
            $deptPermissions,
            $userPermissions,
            $letterPermissions
        );
        
        foreach ($allPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        
        // ============================================
        // ایجاد نقش‌ها و تخصیص مجوزها
        // ============================================
        
        // 1. نقش ادمین کل (دسترسی به همه چیز)
        $superAdmin = Role::create(['name' => 'super-admin']);
        $superAdmin->givePermissionTo(Permission::all());
        
        // 2. نقش ادمین سازمان
        $orgAdmin = Role::create(['name' => 'org-admin']);
        $orgAdmin->givePermissionTo([
            'create-department',
            'edit-department',
            'delete-department',
            'view-department',
            'create-user-in-org',
            'edit-user-in-org',
            'view-users-in-org',
            'assign-role-to-user',
            'create-letter',
            'edit-letter',
            'view-letter',
            'archive-letter',
            'route-letter',
        ]);
        
        // 3. نقش مدیر دپارتمان
        $deptManager = Role::create(['name' => 'dept-manager']);
        $deptManager->givePermissionTo([
            'view-department',
            'create-letter',
            'edit-letter',
            'view-letter',
            'route-letter',
        ]);
        
        // 4. نقش کاربر عادی
        $user = Role::create(['name' => 'user']);
        $user->givePermissionTo([
            'create-letter',
            'view-letter',
        ]);
        
        // ============================================
        // ایجاد کاربر ادمین کل پیش‌فرض
        // ============================================
        
        $superUser = User::create([
            'organization_id' => null,
            'username' => 'superadmin',
            'email' => 'superadmin@system.com',
            'password' => bcrypt('password'),
            'first_name' => 'مدیر',
            'last_name' => 'کل',
            'national_code' => '1111111111',
            'status' => 'active',
        ]);
        $superUser->assignRole(RoleEnum::SUPER_ADMIN->value);
    }
}