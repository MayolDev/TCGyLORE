<?php

namespace Database\Seeders;

use App\Models\Faction;
use App\Models\World;
use Illuminate\Database\Seeder;

class FactionSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        $factions = [
            ['name' => 'Orden de Lumendor', 'description' => 'Magos dedicados a la preservación del conocimiento y la luz', 'color' => '#60A5FA'],
            ['name' => 'Casa Umbravale', 'description' => 'Señores oscuros que controlan las sombras', 'color' => '#8B5CF6'],
            ['name' => 'Flota de la Tormenta', 'description' => 'Piratas y marineros que dominan los mares', 'color' => '#06B6D4'],
            ['name' => 'Círculo Druídico', 'description' => 'Guardianes de la naturaleza y sus secretos', 'color' => '#10B981'],
            ['name' => 'Rebelión de Esclavos', 'description' => 'Luchadores por la libertad y la justicia', 'color' => '#F59E0B'],
            ['name' => 'Orden de la Luz Sagrada', 'description' => 'Paladines dedicados a erradicar la oscuridad', 'color' => '#FBBF24'],
            ['name' => 'Ninguna', 'description' => 'Sin afiliación a ninguna facción', 'color' => '#9CA3AF'],
        ];

        foreach ($factions as $faction) {
            Faction::create(array_merge($faction, ['world_id' => $world->id]));
        }
    }
}

