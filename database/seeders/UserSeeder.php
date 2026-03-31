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
    $org      = Organization::where('code', 'MOE')->first();
    $position = Position::where('code', 'POS-001')->first();

    $user = User::create([
        'organization_id' => $org->id,
        'last_name'       => 'رضایی',
        'name'            => 'علی',
        
        'first_name'      => 'علی',
        'username'        => 'ali.rezaei',
        'email'           => 'ali@moe.ir',
        'password'        => bcrypt('password'),
        'status'          => 'active',
    ]);

    // سمت فعال
    UserPosition::create([
        'user_id'     => $user->id,
        'position_id' => $position->id,
        'start_date'  => now(),
        'status'      => 'active',
    ]);
}
}
