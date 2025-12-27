<?php

namespace Database\Seeders;

use App\Models\Faction;
use Illuminate\Database\Seeder;

class FactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $factions = [
            [
                'name' => 'La Orden del Alba',
                'description' => 'Defensores de la luz y la justicia',
            ],
            [
                'name' => 'El Culto de las Sombras',
                'description' => 'Adoradores de la oscuridad y el caos',
            ],
            [
                'name' => 'Los Guardianes del Bosque',
                'description' => 'Protectores de la naturaleza',
            ],
            [
                'name' => 'La Academia Arcana',
                'description' => 'Estudiosos de la magia y el conocimiento',
            ],
        ];

        foreach ($factions as $faction) {
            Faction::firstOrCreate(
                ['name' => $faction['name']],
                $faction
            );
        }
    }
}
