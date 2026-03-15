<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\LetterCategory;
use App\Models\Organization;
use App\Models\Position;
use App\Models\User;
use App\Models\UserPosition;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ===== ایجاد مجوزها =====
        $permissions = [
            // نامه‌ها
            'letters.view', 'letters.create', 'letters.edit', 'letters.delete',
            'letters.route', 'letters.archive',
            // سازمان
            'organization.view', 'organization.manage',
            'departments.manage', 'positions.manage',
            'users.view', 'users.manage',
            // گزارش‌ها
            'reports.view', 'reports.export',
            // تنظیمات
            'settings.manage',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // ===== ایجاد نقش‌ها =====
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $managerRole->syncPermissions([
            'letters.view', 'letters.create', 'letters.edit', 'letters.route', 'letters.archive',
            'organization.view', 'departments.manage', 'positions.manage',
            'users.view', 'reports.view', 'reports.export',
        ]);

        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $userRole->syncPermissions([
            'letters.view', 'letters.create', 'letters.route',
            'organization.view', 'reports.view',
        ]);

        // ===== ایجاد سازمان نمونه =====
        $org = Organization::firstOrCreate(
            ['code' => 'MAIN'],
            [
                'name'   => 'سازمان مرکزی',
                'phone'  => '021-12345678',
                'email'  => 'info@main.org',
                'status' => 'active',
            ]
        );

        // ===== ایجاد واحدهای سازمانی =====
        $itDept = Department::firstOrCreate(
            ['code' => 'IT', 'organization_id' => $org->id],
            ['name' => 'واحد فناوری اطلاعات', 'status' => 'active']
        );
        $itDept->updatePath();

        $hrDept = Department::firstOrCreate(
            ['code' => 'HR', 'organization_id' => $org->id],
            ['name' => 'واحد منابع انسانی', 'status' => 'active']
        );
        $hrDept->updatePath();

        $mgmtDept = Department::firstOrCreate(
            ['code' => 'MGMT', 'organization_id' => $org->id],
            ['name' => 'مدیریت', 'status' => 'active']
        );
        $mgmtDept->updatePath();

        // ===== ایجاد سمت‌ها =====
        $ceoPos = Position::firstOrCreate(
            ['code' => 'CEO'],
            ['department_id' => $mgmtDept->id, 'name' => 'مدیرعامل', 'level' => 1, 'is_management' => true]
        );
        $itMgrPos = Position::firstOrCreate(
            ['code' => 'IT-MGR'],
            ['department_id' => $itDept->id, 'name' => 'مدیر IT', 'level' => 2, 'is_management' => true]
        );
        $hrPos = Position::firstOrCreate(
            ['code' => 'HR-SPEC'],
            ['department_id' => $hrDept->id, 'name' => 'کارشناس منابع انسانی', 'level' => 3]
        );

        // ===== ایجاد کاربران =====
        $admin = User::firstOrCreate(
            ['email' => 'admin@correspondence.local'],
            [
                'organization_id' => $org->id,
                'username'        => 'admin',
                'first_name'      => 'مدیر',
                'last_name'       => 'سیستم',
                'password'        => Hash::make('password'),
                'status'          => 'active',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        UserPosition::firstOrCreate(
            ['user_id' => $admin->id, 'position_id' => $ceoPos->id],
            ['is_primary' => true, 'status' => 'active', 'start_date' => today()]
        );

        $manager = User::firstOrCreate(
            ['email' => 'manager@correspondence.local'],
            [
                'organization_id' => $org->id,
                'username'        => 'manager',
                'first_name'      => 'علی',
                'last_name'       => 'محمدی',
                'password'        => Hash::make('password'),
                'status'          => 'active',
                'email_verified_at' => now(),
            ]
        );
        $manager->syncRoles(['manager']);

        UserPosition::firstOrCreate(
            ['user_id' => $manager->id, 'position_id' => $itMgrPos->id],
            ['is_primary' => true, 'status' => 'active', 'start_date' => today()]
        );

        $user = User::firstOrCreate(
            ['email' => 'user@correspondence.local'],
            [
                'organization_id' => $org->id,
                'username'        => 'user1',
                'first_name'      => 'فاطمه',
                'last_name'       => 'احمدی',
                'password'        => Hash::make('password'),
                'status'          => 'active',
                'email_verified_at' => now(),
            ]
        );
        $user->syncRoles(['user']);

        UserPosition::firstOrCreate(
            ['user_id' => $user->id, 'position_id' => $hrPos->id],
            ['is_primary' => true, 'status' => 'active', 'start_date' => today()]
        );

        // ===== دسته‌بندی نامه‌ها =====
        $categories = [
            ['name' => 'اداری', 'code' => 'ADM', 'color' => '#3B82F6'],
            ['name' => 'مالی', 'code' => 'FIN', 'color' => '#10B981'],
            ['name' => 'حقوقی', 'code' => 'LEG', 'color' => '#F59E0B'],
            ['name' => 'فنی', 'code' => 'TECH', 'color' => '#8B5CF6'],
        ];

        foreach ($categories as $cat) {
            LetterCategory::firstOrCreate(
                ['code' => $cat['code'], 'organization_id' => $org->id],
                array_merge($cat, ['organization_id' => $org->id, 'status' => true])
            );
        }

        $this->command->info('✅ داده‌های اولیه با موفقیت ایجاد شدند.');
        $this->command->info('📧 ادمین: admin@correspondence.local | رمز: password');
        $this->command->info('📧 مدیر: manager@correspondence.local | رمز: password');
        $this->command->info('📧 کاربر: user@correspondence.local | رمز: password');
    }
}
