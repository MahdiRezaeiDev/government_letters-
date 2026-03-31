<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    // پاک کردن cache
    app()[\Spatie\Permission\PermissionRegistrar::class]
        ->forgetCachedPermissions();

    // ─── دسترسی‌ها ───────────────────────

    $permissions = [
        // نامه‌ها
        'letter.view',
        'letter.create',
        'letter.edit',
        'letter.delete',
        'letter.send-direct',      // ارسال بدون تأیید
        'letter.send-with-approval', // ارسال با تأیید

        // گردش کار
        'routing.create',
        'routing.approve',
        'routing.reject',

        // بایگانی
        'archive.view',
        'archive.manage',

        // گزارش
        'report.view',

        // مدیریت سیستم
        'user.manage',
        'organization.manage',
    ];

    foreach ($permissions as $permission) {
        Permission::create(['name' => $permission]);
    }

    // ─── نقش‌ها ───────────────────────────

    // ادمین — همه دسترسی‌ها
    $admin = Role::create(['name' => 'admin']);
    $admin->givePermissionTo(Permission::all());

    // رئیس — ارسال مستقیم + تأیید
    $chief = Role::create(['name' => 'chief']);
    $chief->givePermissionTo([
        'letter.view',
        'letter.create',
        'letter.edit',
        'letter.send-direct',
        'routing.approve',
        'routing.reject',
        'archive.view',
        'report.view',
    ]);

    // مدیر — ارسال با تأیید
    $manager = Role::create(['name' => 'manager']);
    $manager->givePermissionTo([
        'letter.view',
        'letter.create',
        'letter.edit',
        'letter.send-with-approval',
        'routing.create',
        'routing.approve',
        'archive.view',
    ]);

    // کارشناس — فقط پیش‌نویس
    $expert = Role::create(['name' => 'expert']);
    $expert->givePermissionTo([
        'letter.view',
        'letter.create',
        'letter.send-with-approval',
        'archive.view',
    ]);
}
}
