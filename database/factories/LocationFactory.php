<?php

namespace Database\Factories;

use App\Models\World;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'world_id' => World::factory(),
            'name' => $this->faker->city,
            'description' => $this->faker->paragraph,
            'location_type' => $this->faker->randomElement(['castle', 'city', 'village', 'forest', 'mountain', 'dungeon', 'ruins', 'battlefield', 'port', 'temple', 'cave', 'tower']),
            'coordinate_x' => $this->faker->randomFloat(2, 0, 1536),
            'coordinate_y' => $this->faker->randomFloat(2, 0, 754),
            'image' => null,
            'is_discovered' => $this->faker->boolean,
        ];
    }
}
