<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Department>
 */
class DepartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name"=> $this->faker->name,
            "code"=> $this->faker->unique()->numerify('DEP-####'),
            "parent_id"=> null,
            "manager_position_id"=> null,
            "status"=> $this->faker->randomElement(['active', 'inactive']),
            "level"=> 1,
            "path"=> '1',
        ];
    }
}
