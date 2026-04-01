<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Position;
use App\Models\User;
use App\Models\UserPosition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
        ->create();
        
        $user->assignRole('manager');
    }
}
