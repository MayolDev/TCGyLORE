<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\World;
use Illuminate\Database\Seeder;

/**
 * Los tipos van en INGLES porque son las claves de LOCATION_TYPES en
 * resources/js/components/map-view.tsx (la migracion
 * update_location_types_to_english corria sobre la tabla vacia y este seeder
 * volvia a sembrar en espanol: todos los marcadores caian al icono generico).
 *
 * Las coordenadas usan el lienzo del mapa fantasy: X 0-1536, Y 0-754.
 * El sistema antiguo 0-100 apinaba las diez ubicaciones en la esquina
 * superior izquierda del mapa.
 */
class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        $locations = [
            [
                'name' => 'Lumendor',
                'description' => 'La Ciudad de la Luz Eterna, construida en las Montañas de Cristal. Sus torres brillan día y noche con magia arcana, y su Gran Biblioteca contiene el conocimiento acumulado de mil años. Es el bastión de la Orden de Lumendor y el centro del aprendizaje mágico en Aethermoor.',
                'location_type' => 'city',
                'coordinate_x' => 699,
                'coordinate_y' => 228,
                'is_discovered' => true,
            ],
            [
                'name' => 'Umbravale',
                'description' => 'Una ciudad sombría al norte, rodeada de niebla perpetua. Las cosechas crecen abundantes aquí, pero a un precio terrible. Los ciudadanos viven bajo el gobierno férreo del Señor Malachar, y cada año deben pagar el tributo de sangre.',
                'location_type' => 'city',
                'coordinate_x' => 319,
                'coordinate_y' => 119,
                'is_discovered' => true,
            ],
            [
                'name' => 'Puerto Tormenta',
                'description' => 'El puerto más grande de Aethermoor, donde convergen comerciantes, piratas y aventureros de todas partes. Las tormentas mágicas que azotan constantemente la costa han dado su nombre a la ciudad. Es aquí donde Lyra Corazón de Tormenta tiene su base de operaciones.',
                'location_type' => 'port',
                'coordinate_x' => 1080,
                'coordinate_y' => 459,
                'is_discovered' => true,
            ],
            [
                'name' => 'Bosque Sombrío',
                'description' => 'Un bosque antiguo y consciente que se extiende por leguas. Sus árboles susurran secretos a aquellos que saben escuchar. Morgana Tejealmas habita en su corazón, donde el bosque es más denso y la magia más fuerte.',
                'location_type' => 'forest',
                'coordinate_x' => 848,
                'coordinate_y' => 345,
                'is_discovered' => true,
            ],
            [
                'name' => 'Montañas de Hierro',
                'description' => 'Antiguas montañas que, según la leyenda, son en realidad Titanes de Roca dormidos. Las minas aquí producen el metal más fuerte de Aethermoor, pero los mineros reportan temblores extraños y voces en la oscuridad.',
                'location_type' => 'mountain',
                'coordinate_x' => 467,
                'coordinate_y' => 265,
                'is_discovered' => true,
            ],
            [
                'name' => 'Fortaleza Férrea',
                'description' => 'Una ciudad-fortaleza construida con el hierro de las montañas cercanas. Hogar del Gran Coliseo donde gladiadores luchan por su libertad. Theron Puño de Hierro es el campeón invicto y líder secreto de la rebelión de esclavos.',
                'location_type' => 'castle',
                'coordinate_x' => 547,
                'coordinate_y' => 305,
                'is_discovered' => true,
            ],
            [
                'name' => 'Templo de la Luz Sagrada',
                'description' => 'Un templo reluciente en lo alto de las colinas del sur, sede de la Orden de la Luz Sagrada. Valorian el Justo lidera desde aquí las cruzadas contra la oscuridad. El templo es un lugar de peregrinación y curación para los devotos.',
                'location_type' => 'temple',
                'coordinate_x' => 934,
                'coordinate_y' => 529,
                'is_discovered' => true,
            ],
            [
                'name' => 'Ruinas de Valdrath',
                'description' => 'Las ruinas de una civilización antigua que fue destruida en la Guerra de los Dioses. Tesoros y conocimientos olvidados yacen enterrados aquí, pero también peligros que han matado a cientos de buscadores de fortuna.',
                'location_type' => 'ruins',
                'coordinate_x' => 772,
                'coordinate_y' => 155,
                'is_discovered' => false,
            ],
            [
                'name' => 'Mar de Cristal',
                'description' => 'Un mar interior cuyas aguas brillan con una luminiscencia azul por la noche. Criaturas mágicas habitan sus profundidades, y se dice que en su fondo yace el tesoro que Lyra Corazón de Tormenta busca desesperadamente.',
                'location_type' => 'port',
                'coordinate_x' => 1152,
                'coordinate_y' => 417,
                'is_discovered' => true,
            ],
            [
                'name' => 'La Grieta Eterna',
                'description' => 'Una fisura masiva en la tierra que parece no tener fondo. De ella emanan susurros de locura y poder oscuro. Se cree que es una cicatriz dejada por la Guerra de los Dioses, y que podría ser un portal a otro plano de existencia.',
                'location_type' => 'dungeon',
                'coordinate_x' => 617,
                'coordinate_y' => 195,
                'is_discovered' => false,
            ],
        ];

        foreach ($locations as $location) {
            Location::create(array_merge($location, ['world_id' => $world->id]));
        }
    }
}
