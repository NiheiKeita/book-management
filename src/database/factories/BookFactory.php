<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'isbn' => $this->faker->isbn13(),
            'title' => $this->faker->sentence(3),
            'subtitle' => $this->faker->optional()->sentence(2),
            'author' => $this->faker->name(),
            'publisher' => $this->faker->company(),
            'published_date' => $this->faker->date(),
            'page_count' => $this->faker->numberBetween(100, 1000),
            'cover_image_url' => $this->faker->optional()->imageUrl(),
            'description' => $this->faker->paragraph(3),
            'category' => $this->faker->randomElement(['Programming', 'Web Development', 'Data Science', 'DevOps', 'Mobile']),
            'source' => $this->faker->randomElement(['oreilly', 'google', 'manual']),
        ];
    }
}
