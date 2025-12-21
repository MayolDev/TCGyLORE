<?php

namespace Database\Seeders;

use App\Models\Character;
use App\Models\Location;
use App\Models\TimelineEvent;
use App\Models\World;
use Illuminate\Database\Seeder;

class TimelineEventSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        // Crear eventos
        $events = [
            [
                'year' => -2000,
                'name' => 'Guerra de los Dioses',
                'description' => 'Los Primigenios libraron una guerra devastadora que casi destruyó Aethermoor. Los Titanes de Roca fueron derrotados y transformados en montañas como castigo. Esta guerra dejó cicatrices en el mundo que aún persisten, como la Grieta Eterna.',
                'event_type' => 'guerra',
                'importance' => 'crucial',
            ],
            [
                'year' => -1000,
                'name' => 'Fundación de Lumendor',
                'description' => 'La maga Elyndra y sus seguidores fundaron Lumendor en las Montañas de Cristal, creando el primer bastión de conocimiento mágico organizado. Este evento marcó el comienzo de una nueva era de civilización en Aethermoor.',
                'event_type' => 'fundacion',
                'importance' => 'crucial',
            ],
            [
                'year' => -547,
                'name' => 'El Pacto de Sangre',
                'description' => 'Desesperado por salvar a su pueblo de la hambruna, el Señor Malachar invocó a los dioses oscuros y realizó el Pacto de Sangre, transformándose en un ser inmortal maldito y condenando a Umbravale a una oscuridad eterna.',
                'event_type' => 'traicion',
                'importance' => 'importante',
            ],
            [
                'year' => -320,
                'name' => 'Caída de Valdrath',
                'description' => 'La próspera civilización de Valdrath fue destruida en una sola noche por una catástrofe mágica de origen desconocido. Miles murieron, y la ciudad quedó en ruinas. Hasta hoy, nadie sabe qué causó exactamente la destrucción.',
                'event_type' => 'catastrofe',
                'importance' => 'crucial',
            ],
            [
                'year' => -200,
                'name' => 'Descubrimiento del Orbe de los Mil Caminos',
                'description' => 'Un joven huérfano llamado Sylas encontró el Orbe de los Mil Caminos en las Ruinas de Valdrath, obteniendo el poder de ver todos los futuros posibles pero condenándose a vagar eternamente.',
                'event_type' => 'descubrimiento',
                'importance' => 'importante',
            ],
            [
                'year' => -100,
                'name' => 'Fundación del Templo de la Luz Sagrada',
                'description' => 'Valorian y sus seguidores construyeron el Templo de la Luz Sagrada, estableciendo una orden dedicada a combatir la oscuridad. Su celo a veces cruzaba la línea hacia el fanatismo.',
                'event_type' => 'fundacion',
                'importance' => 'importante',
            ],
            [
                'year' => -50,
                'name' => 'La Gran Tormenta',
                'description' => 'Una tormenta mágica de proporciones cataclísmicas azotó la costa durante tres días. Cuando terminó, las aguas del puerto brillaban con magia, y una joven pirata llamada Lyra había obtenido el poder de controlar las tormentas.',
                'event_type' => 'catastrofe',
                'importance' => 'importante',
            ],
            [
                'year' => -25,
                'name' => 'Despertar del Bosque Sombrío',
                'description' => 'El antiguo bosque cobró consciencia colectiva, convirtiéndose en una entidad viva. Morgana fue la primera en establecer comunicación con él y establecer su hogar en su corazón.',
                'event_type' => 'descubrimiento',
                'importance' => 'importante',
            ],
            [
                'year' => -10,
                'name' => 'Rebelión del Coliseo',
                'description' => 'Theron Puño de Hierro lideró el primer alzamiento masivo de esclavos en Fortaleza Férrea. Aunque fue sofocada, marcó el comienzo de una resistencia organizada.',
                'event_type' => 'guerra',
                'importance' => 'importante',
            ],
            [
                'year' => 0,
                'name' => 'Tratado de las Cinco Ciudades',
                'description' => 'Los líderes de Lumendor, Umbravale, Puerto Tormenta, Fortaleza Férrea y el Templo de la Luz Sagrada firmaron un tratado de no agresión, estableciendo fronteras y reglas de comercio. Esta paz frágil ha durado hasta hoy.',
                'event_type' => 'paz',
                'importance' => 'crucial',
            ],
            [
                'year' => 5,
                'name' => 'Primera Profecía del Errante',
                'description' => 'Sylas apareció en el Gran Consejo de Lumendor y pronunció su primera profecía pública: "Cuando las montañas se agrieten y los mares hiervan, cuando la luz proyecte sombras y la oscuridad brille, el equilibrio será roto. Y entonces, todos deberán elegir."',
                'event_type' => 'descubrimiento',
                'importance' => 'crucial',
            ],
            [
                'year' => 10,
                'name' => 'La Búsqueda del Tesoro Perdido',
                'description' => 'Lyra Corazón de Tormenta inició su búsqueda del legendario Tesoro del Mar de Cristal, un artefacto que supuestamente podría cambiar el equilibrio de poder en Aethermoor. Su búsqueda continúa.',
                'event_type' => 'descubrimiento',
                'importance' => 'menor',
            ],
            [
                'year' => 15,
                'name' => 'Alianza de los Reinos del Norte',
                'description' => 'Umbravale y las ciudades del norte formaron una alianza secreta, preocupando a los líderes del sur. Las tensiones han aumentado, y muchos temen que el Tratado de las Cinco Ciudades pueda romperse pronto.',
                'event_type' => 'alianza',
                'importance' => 'importante',
            ],
        ];

        foreach ($events as $eventData) {
            $event = TimelineEvent::create(array_merge($eventData, ['world_id' => $world->id]));

            // Asociar personajes relevantes a eventos
            if ($eventData['year'] == -1000) {
                $elyndra = Character::where('name', 'Elyndra la Sabia')->first();
                $lumendor = Location::where('name', 'Lumendor')->first();
                if ($elyndra) {
                    $event->characters()->attach($elyndra->id);
                }
                if ($lumendor) {
                    $event->locations()->attach($lumendor->id);
                }
            }

            if ($eventData['year'] == -547) {
                $malachar = Character::where('name', 'Malachar el Maldito')->first();
                $umbravale = Location::where('name', 'Umbravale')->first();
                if ($malachar) {
                    $event->characters()->attach($malachar->id);
                }
                if ($umbravale) {
                    $event->locations()->attach($umbravale->id);
                }
            }

            if ($eventData['year'] == -200) {
                $sylas = Character::where('name', 'Sylas el Errante')->first();
                $valdrath = Location::where('name', 'Ruinas de Valdrath')->first();
                if ($sylas) {
                    $event->characters()->attach($sylas->id);
                }
                if ($valdrath) {
                    $event->locations()->attach($valdrath->id);
                }
            }

            if ($eventData['year'] == -50) {
                $lyra = Character::where('name', 'Lyra Corazón de Tormenta')->first();
                $puerto = Location::where('name', 'Puerto Tormenta')->first();
                if ($lyra) {
                    $event->characters()->attach($lyra->id);
                }
                if ($puerto) {
                    $event->locations()->attach($puerto->id);
                }
            }

            if ($eventData['year'] == -25) {
                $morgana = Character::where('name', 'Morgana Tejealmas')->first();
                $bosque = Location::where('name', 'Bosque Sombrío')->first();
                if ($morgana) {
                    $event->characters()->attach($morgana->id);
                }
                if ($bosque) {
                    $event->locations()->attach($bosque->id);
                }
            }

            if ($eventData['year'] == -10) {
                $theron = Character::where('name', 'Theron Puño de Hierro')->first();
                $fortaleza = Location::where('name', 'Fortaleza Férrea')->first();
                if ($theron) {
                    $event->characters()->attach($theron->id);
                }
                if ($fortaleza) {
                    $event->locations()->attach($fortaleza->id);
                }
            }

            if ($eventData['year'] == -100) {
                $valorian = Character::where('name', 'Valorian el Justo')->first();
                $templo = Location::where('name', 'Templo de la Luz Sagrada')->first();
                if ($valorian) {
                    $event->characters()->attach($valorian->id);
                }
                if ($templo) {
                    $event->locations()->attach($templo->id);
                }
            }
        }
    }
}
