<?php

namespace Database\Factories;

use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Position>
 */
class PositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => $this->faker->jobTitle(),
            "code" => "POS-" . $this->faker->unique()->numerify('###'),
            "level" => $this->faker->numberBetween(1, 5),
            "is_management" => $this->faker->boolean(30), // 30% chance of being a management position
            "description" => $this->faker->sentence(),
        ];
    }
}
