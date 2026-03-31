<?php

namespace Database\Seeders;

use App\Models\LetterCategory;
use App\Models\Organization;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LetterCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $org = Organization::where('code', 'MOE')->first();

    $categories = [
        ['name' => 'مکاتبات اداری',  'code' => 'ADM'],
        ['name' => 'مکاتبات مالی',   'code' => 'FIN'],
        ['name' => 'مکاتبات حقوقی',  'code' => 'LEG'],
        ['name' => 'مکاتبات فنی',    'code' => 'TEC'],
    ];

    foreach ($categories as $cat) {
        LetterCategory::create([
            'organization_id' => $org->id,
            'name'            => $cat['name'],
            'code'            => $cat['code'],
            'status'          => true,
        ]);
    }
}
}
