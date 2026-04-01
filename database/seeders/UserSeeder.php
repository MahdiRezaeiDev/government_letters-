<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        $user = User::factory()
        ->count(3)
        ->has(Organization::factory(), 'organization')
        ->create();
        
        // $user->assignRole('manager');
    }
}
