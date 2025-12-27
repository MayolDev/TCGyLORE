<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artists = [
            [
                'name' => 'Elena Darkwood',
                'email' => 'elena@example.com',
                'bio' => 'Artista especializada en criaturas fantásticas',
            ],
            [
                'name' => 'Marcus Lightbringer',
                'email' => 'marcus@example.com',
                'bio' => 'Ilustrador de paisajes épicos',
            ],
        ];

        foreach ($artists as $artist) {
            Artist::firstOrCreate(
                ['name' => $artist['name']],
                $artist
            );
        }
    }
}
