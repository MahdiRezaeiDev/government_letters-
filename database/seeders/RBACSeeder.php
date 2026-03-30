<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use App\Services\RolePermissionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RBACSeeder extends Seeder
{
    public function __construct(private readonly RolePermissionService $service) {}

    public function run(): void
    {
        // ۱. ایجاد همه دسترسی‌ها
        $this->service->seedPermissions();

        // ۲. ایجاد نقش‌های پیش‌فرض
        $adminRole = $this->service->createRole('super-admin', 
            \Spatie\Permission\Models\Permission::pluck('name')->toArray()
        );

        $managerRole = $this->service->createRole('manager', [
            'user.view', 'letter.view', 'letter.create', 
            'letter.send', 'report.view', 'report.export',
        ]);

        $staffRole = $this->service->createRole('staff', [
            'letter.view', 'letter.create',
        ]);

        // ۳. ایجاد سازمان اولیه
        $org = Organization::firstOrCreate(
            ['code' => 'MAIN'],
            [
                'name'   => 'سازمان اصلی',
                'status' => 'active',
            ]
        );

        // ۴. ایجاد ادمین اصلی
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'organization_id' => $org->id,
                'username'        => 'admin',
                'first_name'      => 'مدیر',
                'last_name'       => 'سیستم',
                'password'        => Hash::make('password'),
                'status'          => 'active',
            ]
        );

        $admin->assignRole('super-admin');
    }
}