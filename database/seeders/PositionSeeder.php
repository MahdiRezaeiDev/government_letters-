<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $dept = Department::where('code', 'FIN')->first();

    Position::create([
        'department_id' => $dept->id,
        'name'          => 'معاون مالی',
        'code'          => 'POS-001',
        'level'         => 1,
        'is_management' => true,
    ]);

    Position::create([
        'department_id' => $dept->id,
        'name'          => 'کارشناس مالی',
        'code'          => 'POS-002',
        'level'         => 3,
        'is_management' => false,
    ]);
}
}
