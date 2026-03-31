<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
{
    // سازمان اصلی ما
    Organization::create([
        'name'   => 'وزارت آموزش و پرورش',
        'code'   => 'MOE',
        'status' => 'active',
    ]);

    // وزارتخانه‌های طرف مکاتبه
    Organization::create([
        'name'   => 'وزارت اقتصاد',
        'code'   => 'MOF',
        'status' => 'active',
    ]);

    Organization::create([
        'name'   => 'وزارت کشور',
        'code'   => 'MOI',
        'status' => 'active',
    ]);
}
}
