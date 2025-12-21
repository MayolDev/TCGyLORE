<?php

namespace Database\Seeders;

use App\Models\Alignment;
use Illuminate\Database\Seeder;

class AlignmentSeeder extends Seeder
{
    public function run(): void
    {
        $alignments = [
            ['name' => 'Luz', 'icon' => '☀️', 'description' => 'Representa el bien, la justicia y la protección'],
            ['name' => 'Oscuridad', 'icon' => '🌙', 'description' => 'Representa el mal, el poder y la ambición'],
            ['name' => 'Neutral', 'icon' => '⚖️', 'description' => 'Equilibrio entre luz y oscuridad'],
            ['name' => 'Caos', 'icon' => '🌀', 'description' => 'Impredecible y destructivo'],
            ['name' => 'Orden', 'icon' => '🛡️', 'description' => 'Estructura y control'],
        ];

        foreach ($alignments as $alignment) {
            Alignment::create($alignment);
        }
    }
}

