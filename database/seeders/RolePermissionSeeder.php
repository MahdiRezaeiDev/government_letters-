<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // پاک کردن کش
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // ============================================
        // 1. تعریف همه مجوزها (Permissions)
        // ============================================
        
        $permissions = [
            // مجوزهای سازمانی (فقط ادمین کل)
            'view-organizations',
            'create-organization',
            'edit-organization',
            'delete-organization',
            
            // مجوزهای دپارتمان (ادمین سازمان)
            'view-departments',
            'create-department',
            'edit-department',
            'delete-department',
            
            // مجوزهای سمت (ادمین سازمان)
            'view-positions',
            'create-position',
            'edit-position',
            'delete-position',
            
            // مجوزهای کاربری (ادمین سازمان)
            'view-users',
            'create-user',
            'edit-user',
            'delete-user',
            'assign-role',
            
            // مجوزهای نامه (همه کاربران)
            'view-letters',
            'create-letter',
            'edit-letter',
            'delete-letter',
            'archive-letter',
            'route-letter',
            'approve-letter',
            'sign-letter',
            
            // مجوزهای دسته‌بندی (ادمین سازمان)
            'view-categories',
            'create-category',
            'edit-category',
            'delete-category',
            
            // مجوزهای بایگانی
            'view-archives',
            'create-archive',
            'edit-archive',
            'delete-archive',
            
            // مجوزهای گزارشات
            'view-reports',
            'export-reports',
        ];
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }
        
        $this->command->info('✅ ' . count($permissions) . ' مجوز ایجاد شد.');

        // ============================================
        // 2. ایجاد نقش‌ها (Roles)
        // ============================================
        
        // نقش 1: ادمین کل (دسترسی به همه چیز)
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $superAdminRole->syncPermissions(Permission::all());
        $this->command->info('✅ نقش ادمین کل ایجاد شد.');
        
        // نقش 2: ادمین سازمان
        $orgAdminRole = Role::firstOrCreate(['name' => 'org-admin', 'guard_name' => 'web']);
        $orgAdminRole->syncPermissions([
            'view-departments', 'create-department', 'edit-department', 'delete-department',
            'view-positions', 'create-position', 'edit-position', 'delete-position',
            'view-users', 'create-user', 'edit-user', 'delete-user', 'assign-role',
            'view-letters', 'create-letter', 'edit-letter', 'archive-letter', 'route-letter', 'approve-letter',
            'view-categories', 'create-category', 'edit-category', 'delete-category',
            'view-archives', 'create-archive', 'edit-archive', 'delete-archive',
            'view-reports', 'export-reports',
        ]);
        $this->command->info('✅ نقش ادمین سازمان ایجاد شد.');
        
        // نقش 3: مدیر دپارتمان
        $deptManagerRole = Role::firstOrCreate(['name' => 'dept-manager', 'guard_name' => 'web']);
        $deptManagerRole->syncPermissions([
            'view-departments',
            'view-letters', 'create-letter', 'edit-letter', 'archive-letter', 'route-letter', 'approve-letter',
            'view-reports',
        ]);
        $this->command->info('✅ نقش مدیر دپارتمان ایجاد شد.');
        
        // نقش 4: کاربر عادی
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $userRole->syncPermissions([
            'view-letters', 'create-letter',
        ]);
        $this->command->info('✅ نقش کاربر عادی ایجاد شد.');

        // ============================================
        // 3. ایجاد کاربر ادمین کل
        // ============================================
        
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@system.com'],
            [
                'organization_id' => null,
                'password' => Hash::make('password'),
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
        $superAdmin->assignRole('super-admin');
        
        $this->command->info('✅ کاربر ادمین کل ایجاد شد.');
        $this->command->info('📧 ایمیل: superadmin@system.com');
        $this->command->info('🔑 رمز عبور: password');
    }
}