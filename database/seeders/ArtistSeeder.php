<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    public function run(): void
    {
        $artists = [
            ['name' => 'María González', 'website' => 'https://mariagonzalez.art', 'bio' => 'Especialista en arte fantástico y criaturas míticas'],
            ['name' => 'Carlos Mendoza', 'website' => 'https://carlosmendoza.art', 'bio' => 'Maestro del arte oscuro y atmosférico'],
            ['name' => 'Ana Rodríguez', 'website' => 'https://anarodriguez.art', 'bio' => 'Experta en paisajes fantásticos y magia'],
            ['name' => 'Pedro Sánchez', 'website' => 'https://pedrosanchez.art', 'bio' => 'Ilustrador de escenas épicas y batallas'],
            ['name' => 'Luis Martínez', 'website' => 'https://luismartinez.art', 'bio' => 'Especializado en personajes heroicos'],
            ['name' => 'Elena Torres', 'website' => 'https://elenatorres.art', 'bio' => 'Arte luminoso y místico'],
            ['name' => 'Ricardo Gómez', 'website' => 'https://ricardogomez.art', 'bio' => 'Ilustrador de horror y magia oscura'],
            ['name' => 'Sofía Ramírez', 'website' => 'https://sofiaramirez.art', 'bio' => 'Experta en criaturas y bestiarios'],
            ['name' => 'Miguel Herrera', 'website' => 'https://miguelherrera.art', 'bio' => 'Arte naturalista y fauna fantástica'],
            ['name' => 'Laura Díaz', 'website' => 'https://lauradiaz.art', 'bio' => 'Especialista en elementos y magia elemental'],
            ['name' => 'Javier López', 'website' => 'https://javierlopez.art', 'bio' => 'Ilustrador de armas y armaduras legendarias'],
            ['name' => 'Carmen Ruiz', 'website' => 'https://carmenruiz.art', 'bio' => 'Arte místico y artefactos antiguos'],
            ['name' => 'Daniel Castro', 'website' => 'https://danielcastro.art', 'bio' => 'Paisajes desolados y ruinas'],
            ['name' => 'Fernando Silva', 'website' => 'https://fernandosilva.art', 'bio' => 'Gigantes y titanes'],
            ['name' => 'Patricia Morales', 'website' => 'https://patriciamorales.art', 'bio' => 'Magia elemental y tormentas'],
        ];

        foreach ($artists as $artist) {
            Artist::create($artist);
        }
    }
}

