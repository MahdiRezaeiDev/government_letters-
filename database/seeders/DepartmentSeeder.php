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
        $organizations = Organization::all();
        
        if ($organizations->isEmpty()) {
            $organizations = Organization::factory()->count(3)->create();
        }
        
        Department::factory()
            ->count(3)
            ->for($organizations->random(), 'organization')
            ->create();
    }
}