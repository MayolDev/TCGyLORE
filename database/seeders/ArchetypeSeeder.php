<?php

namespace Database\Seeders;

use App\Models\Archetype;
use Illuminate\Database\Seeder;

class ArchetypeSeeder extends Seeder
{
    public function run(): void
    {
        $archetypes = [
            ['name' => 'Mago', 'description' => 'Maestros de la magia arcana'],
            ['name' => 'Guerrero', 'description' => 'Expertos en combate cuerpo a cuerpo'],
            ['name' => 'Pícaro', 'description' => 'Astutos y sigilosos'],
            ['name' => 'Paladín', 'description' => 'Guerreros sagrados'],
            ['name' => 'Druida', 'description' => 'Guardianes de la naturaleza'],
            ['name' => 'Hechicero', 'description' => 'Magia innata y poderosa'],
            ['name' => 'Clérigo', 'description' => 'Siervos de los dioses'],
            ['name' => 'Explorador', 'description' => 'Maestros del sigilo y la supervivencia'],
            ['name' => 'Bardo', 'description' => 'Artistas y encantadores'],
            ['name' => 'Monje', 'description' => 'Maestros de las artes marciales'],
            ['name' => 'Bárbaro', 'description' => 'Furia desatada en combate'],
            ['name' => 'Brujo', 'description' => 'Pactantes con entidades oscuras'],
            ['name' => 'Caballero', 'description' => 'Nobles guerreros con honor'],
            ['name' => 'Asesino', 'description' => 'Maestros del asesinato'],
            ['name' => 'Nigromante', 'description' => 'Manipuladores de la muerte'],
            ['name' => 'Elementalista', 'description' => 'Controladores de los elementos'],
            ['name' => 'Invocador', 'description' => 'Llaman criaturas a su servicio'],
            ['name' => 'Artesano', 'description' => 'Creadores de artefactos mágicos'],
            ['name' => 'Bestia', 'description' => 'Criaturas salvajes'],
            ['name' => 'Demonio', 'description' => 'Entidades infernales'],
            ['name' => 'Ángel', 'description' => 'Seres celestiales'],
            ['name' => 'Dragón', 'description' => 'Criaturas legendarias'],
            ['name' => 'Espíritu', 'description' => 'Entidades etéreas'],
            ['name' => 'Construcción', 'description' => 'Seres creados artificialmente'],
            ['name' => 'Titán', 'description' => 'Gigantes ancestrales'],
        ];

        foreach ($archetypes as $archetype) {
            Archetype::create($archetype);
        }
    }
}

