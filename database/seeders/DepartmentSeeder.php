<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Organization;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $org = Organization::where('code', 'MOE')->first();

    // واحد اصلی
    $financial = Department::create([
        'organization_id' => $org->id,
        'name'            => 'معاونت مالی',
        'code'            => 'FIN',
        'level'           => 1,
        'path'            => '1',
        'status'          => 'active',
    ]);

    // زیرمجموعه
    Department::create([
        'organization_id' => $org->id,
        'name'            => 'اداره حسابداری',
        'code'            => 'ACC',
        'parent_id'       => $financial->id,
        'level'           => 2,
        'path'            => '1/' . $financial->id,
        'status'          => 'active',
    ]);
}
}
