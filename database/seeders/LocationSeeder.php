<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\World;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        // Coordenadas distribuidas por el mapa (imagen 1536x754 píxeles)
        // Distribuidas en una cuadrícula 3x3 + centro para buena cobertura visual
        $locations = [
            [
                'name' => 'Lumendor',
                'description' => 'La Ciudad de la Luz Eterna, construida en las Montañas de Cristal. Sus torres brillan día y noche con magia arcana, y su Gran Biblioteca contiene el conocimiento acumulado de mil años. Es el bastión de la Orden de Lumendor y el centro del aprendizaje mágico en Aethermoor.',
                'type' => 'city',
                'location_type' => 'ciudad',
                'coordinate_x' => 768, // Centro del mapa
                'coordinate_y' => 377,
                'is_discovered' => true,
            ],
            [
                'name' => 'Umbravale',
                'description' => 'Una ciudad sombría al norte, rodeada de niebla perpetua. Las cosechas crecen abundantes aquí, pero a un precio terrible. Los ciudadanos viven bajo el gobierno férreo del Señor Malachar, y cada año deben pagar el tributo de sangre.',
                'type' => 'city',
                'location_type' => 'ciudad',
                'coordinate_x' => 384, // Superior izquierda
                'coordinate_y' => 150,
                'is_discovered' => true,
            ],
            [
                'name' => 'Puerto Tormenta',
                'description' => 'El puerto más grande de Aethermoor, donde convergen comerciantes, piratas y aventureros de todas partes. Las tormentas mágicas que azotan constantemente la costa han dado su nombre a la ciudad. Es aquí donde Lyra Corazón de Tormenta tiene su base de operaciones.',
                'type' => 'port',
                'location_type' => 'ciudad',
                'coordinate_x' => 1280, // Inferior derecha
                'coordinate_y' => 604,
                'is_discovered' => true,
            ],
            [
                'name' => 'Bosque Sombrío',
                'description' => 'Un bosque antiguo y consciente que se extiende por leguas. Sus árboles susurran secretos a aquellos que saben escuchar. Morgana Tejealmas habita en su corazón, donde el bosque es más denso y la magia más fuerte.',
                'type' => 'forest',
                'location_type' => 'bosque',
                'coordinate_x' => 640, // Centro-izquierda
                'coordinate_y' => 377,
                'is_discovered' => true,
            ],
            [
                'name' => 'Montañas de Hierro',
                'description' => 'Antiguas montañas que, según la leyenda, son en realidad Titanes de Roca dormidos. Las minas aquí producen el metal más fuerte de Aethermoor, pero los mineros reportan temblores extraños y voces en la oscuridad.',
                'type' => 'mountain',
                'location_type' => 'montaña',
                'coordinate_x' => 256, // Extremo superior izquierda
                'coordinate_y' => 100,
                'is_discovered' => true,
            ],
            [
                'name' => 'Fortaleza Férrea',
                'description' => 'Una ciudad-fortaleza construida con el hierro de las montañas cercanas. Hogar del Gran Coliseo donde gladiadores luchan por su libertad. Theron Puño de Hierro es el campeón invicto y líder secreto de la rebelión de esclavos.',
                'type' => 'castle',
                'location_type' => 'ciudad',
                'coordinate_x' => 512, // Centro superior
                'coordinate_y' => 188,
                'is_discovered' => true,
            ],
            [
                'name' => 'Templo de la Luz Sagrada',
                'description' => 'Un templo reluciente en lo alto de las colinas del sur, sede de la Orden de la Luz Sagrada. Valorian el Justo lidera desde aquí las cruzadas contra la oscuridad. El templo es un lugar de peregrinación y curación para los devotos.',
                'type' => 'temple',
                'location_type' => 'templo',
                'coordinate_x' => 896, // Centro-derecha inferior
                'coordinate_y' => 566,
                'is_discovered' => true,
            ],
            [
                'name' => 'Ruinas de Valdrath',
                'description' => 'Las ruinas de una civilización antigua que fue destruida en la Guerra de los Dioses. Tesoros y conocimientos olvidados yacen enterrados aquí, pero también peligros que han matado a cientos de buscadores de fortuna.',
                'type' => 'ruins',
                'location_type' => 'ruina',
                'coordinate_x' => 1152, // Superior derecha
                'coordinate_y' => 188,
                'is_discovered' => false,
            ],
            [
                'name' => 'Mar de Cristal',
                'description' => 'Un mar interior cuyas aguas brillan con una luminiscencia azul por la noche. Criaturas mágicas habitan sus profundidades, y se dice que en su fondo yace el tesoro que Lyra Corazón de Tormenta busca desesperadamente.',
                'type' => 'port',
                'location_type' => 'mar',
                'coordinate_x' => 1400, // Extremo derecha
                'coordinate_y' => 377,
                'is_discovered' => true,
            ],
            [
                'name' => 'La Grieta Eterna',
                'description' => 'Una fisura masiva en la tierra que parece no tener fondo. De ella emanan susurros de locura y poder oscuro. Se cree que es una cicatriz dejada por la Guerra de los Dioses, y que podría ser un portal a otro plano de existencia.',
                'type' => 'dungeon',
                'location_type' => 'mazmorra',
                'coordinate_x' => 320, // Inferior izquierda
                'coordinate_y' => 604,
                'is_discovered' => false,
            ],
        ];

        foreach ($locations as $location) {
            Location::create(array_merge($location, ['world_id' => $world->id]));
        }
    }
}
