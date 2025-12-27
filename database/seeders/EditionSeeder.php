<?php

namespace Database\Seeders;

use App\Models\Edition;
use Illuminate\Database\Seeder;

class EditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $editions = [
            [
                'name' => 'Primera Edición',
                'description' => 'La primera colección de cartas',
                'release_date' => '2024-01-01',
            ],
            [
                'name' => 'Edición Alpha',
                'description' => 'Edición de prueba limitada',
                'release_date' => '2024-06-01',
            ],
        ];

        foreach ($editions as $edition) {
            Edition::firstOrCreate(
                ['name' => $edition['name']],
                $edition
            );
        }
    }
}
