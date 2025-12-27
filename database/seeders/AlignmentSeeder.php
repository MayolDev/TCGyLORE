<?php

namespace Database\Seeders;

use App\Models\Alignment;
use Illuminate\Database\Seeder;

class AlignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alignments = [
            [
                'name' => 'Luz',
                'description' => 'Cartas que representan el bien, la justicia y el orden',
            ],
            [
                'name' => 'Oscuridad',
                'description' => 'Cartas que representan el mal, el caos y las sombras',
            ],
            [
                'name' => 'Neutral',
                'description' => 'Cartas que no pertenecen a ningún bando específico',
            ],
        ];

        foreach ($alignments as $alignment) {
            Alignment::firstOrCreate(
                ['name' => $alignment['name']],
                $alignment
            );
        }
    }
}
