<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Enums\PermissionEnum;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. پاک کردن کش
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $this->command->info('📌 شروع ایجاد مجوزها و نقش‌ها...');

        // ============================================
        // 2. ایجاد همه مجوزها
        // ============================================
        
        $permissions = PermissionEnum::all();
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }
        
        $this->command->info('✅ ' . count($permissions) . ' مجوز ایجاد شد.');

        // ============================================
        // 3. ایجاد نقش‌ها و تخصیص مجوزها
        // ============================================

        // نقش 1: ادمین کل
        $superAdminRole = Role::firstOrCreate([
            'name' => RoleEnum::SUPER_ADMIN->value,
            'guard_name' => 'web'
        ]);
        $superAdminRole->syncPermissions(PermissionEnum::superAdminPermissions());
        $this->command->info('✅ نقش ادمین کل ایجاد شد.');

        // نقش 2: ادمین سازمان
        $orgAdminRole = Role::firstOrCreate([
            'name' => RoleEnum::ORG_ADMIN->value,
            'guard_name' => 'web'
        ]);
        $orgAdminRole->syncPermissions(PermissionEnum::orgAdminPermissions());
        $this->command->info('✅ نقش ادمین سازمان ایجاد شد.');

        // نقش 3: مدیر دپارتمان
        $deptManagerRole = Role::firstOrCreate([
            'name' => RoleEnum::DEPT_MANAGER->value,
            'guard_name' => 'web'
        ]);
        $deptManagerRole->syncPermissions(PermissionEnum::deptManagerPermissions());
        $this->command->info('✅ نقش مدیر دپارتمان ایجاد شد.');

        // نقش 4: کاربر عادی
        $userRole = Role::firstOrCreate([
            'name' => RoleEnum::USER->value,
            'guard_name' => 'web'
        ]);
        $userRole->syncPermissions(PermissionEnum::userPermissions());
        $this->command->info('✅ نقش کاربر عادی ایجاد شد.');

        // ============================================
        // 4. ایجاد کاربر ادمین کل پیش‌فرض
        // ============================================
        
        $superUser = User::updateOrCreate(
            ['email' => 'superadmin@system.com'],
            [
                'organization_id' => null,
                'department_id' => null,
                'primary_position_id' => null,
                'username' => 'superadmin',
                'password' => bcrypt('password'),
                'first_name' => 'مدیر',
                'last_name' => 'کل',
                'national_code' => '1111111111',
                'mobile' => '09120000000',
                'employment_code' => 'EMP0001',
                'status' => 'active',
                'security_clearance' => 'secret',
                'email_verified_at' => now(),
            ]
        );
        $superUser->syncRoles([RoleEnum::SUPER_ADMIN->value]);
        
        $this->command->info('✅ کاربر ادمین کل ایجاد شد.');
        $this->command->info('📧 ایمیل: superadmin@system.com');
        $this->command->info('🔑 رمز عبور: password');
        
        $this->command->info('🎉 عملیات با موفقیت به پایان رسید!');
    }
}