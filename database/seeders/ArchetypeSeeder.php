<?php

namespace Database\Seeders;

use App\Models\Archetype;
use Illuminate\Database\Seeder;

class ArchetypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $archetypes = [
            [
                'name' => 'Guerrero',
                'description' => 'Especialistas en combate cuerpo a cuerpo',
            ],
            [
                'name' => 'Mago',
                'description' => 'Maestros de las artes arcanas',
            ],
            [
                'name' => 'Pícaro',
                'description' => 'Expertos en sigilo y velocidad',
            ],
            [
                'name' => 'Clérigo',
                'description' => 'Sanadores y portadores de luz divina',
            ],
            [
                'name' => 'Druida',
                'description' => 'Guardianes de la naturaleza',
            ],
            [
                'name' => 'Paladín',
                'description' => 'Guerreros sagrados que defienden el bien',
            ],
            [
                'name' => 'Nigromante',
                'description' => 'Manipuladores de la muerte y la no-vida',
            ],
        ];

        foreach ($archetypes as $archetype) {
            Archetype::firstOrCreate(
                ['name' => $archetype['name']],
                $archetype
            );
        }
    }
}
