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
        $organizations = Organization::all();

        User::factory()
        ->count(3)
        ->for($organizations->random(), 'organization')
        ->create();
        
        // $user->assignRole('manager');
    }
}
