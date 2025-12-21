<?php

namespace Database\Seeders;

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Character;
use App\Models\Faction;
use App\Models\Rarity;
use App\Models\World;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        // Obtener catálogos
        $criaturaLegendaria = CardType::where('slug', 'criatura-legendaria')->first();
        $hechizo = CardType::where('slug', 'hechizo')->first();
        $hechizoInstantaneo = CardType::where('slug', 'hechizo-instantaneo')->first();
        $artefacto = CardType::where('slug', 'artefacto')->first();
        $artefactoEquipo = CardType::where('slug', 'artefacto-equipo')->first();
        $artefactoLegendario = CardType::where('slug', 'artefacto-legendario')->first();
        $tierraLegendaria = CardType::where('slug', 'tierra-legendaria')->first();
        $criatura = CardType::where('slug', 'criatura')->first();

        $comun = Rarity::where('slug', 'comun')->first();
        $rara = Rarity::where('slug', 'rara')->first();
        $epica = Rarity::where('slug', 'epica')->first();
        $legendaria = Rarity::where('slug', 'legendaria')->first();

        $luz = Alignment::where('slug', 'luz')->first();
        $oscuridad = Alignment::where('slug', 'oscuridad')->first();
        $neutral = Alignment::where('slug', 'neutral')->first();

        $ordenLumendor = Faction::where('slug', 'orden-de-lumendor')->first();
        $casaUmbravale = Faction::where('slug', 'casa-umbravale')->first();
        $flotaTormenta = Faction::where('slug', 'flota-de-la-tormenta')->first();
        $circuloDruidico = Faction::where('slug', 'circulo-druidico')->first();
        $rebelionEsclavos = Faction::where('slug', 'rebelion-de-esclavos')->first();
        $ordenLuzSagrada = Faction::where('slug', 'orden-de-la-luz-sagrada')->first();
        $sinFaccion = Faction::where('slug', 'ninguna')->first();

        $mago = Archetype::where('slug', 'mago')->first();
        $senorOscuro = Archetype::where('slug', 'brujo')->first();
        $errante = Archetype::where('slug', 'explorador')->first();
        $pirata = Archetype::where('slug', 'picaro')->first();
        $guerrero = Archetype::where('slug', 'guerrero')->first();
        $constructo = Archetype::where('slug', 'construccion')->first();
        $bestia = Archetype::where('slug', 'bestia')->first();
        $titan = Archetype::where('slug', 'titan')->first();

        // Obtener personajes
        $elyndra = Character::where('name', 'Elyndra la Sabia')->first();
        $malachar = Character::where('name', 'Malachar el Maldito')->first();
        $sylas = Character::where('name', 'Sylas el Errante')->first();
        $lyra = Character::where('name', 'Lyra Corazón de Tormenta')->first();
        $theron = Character::where('name', 'Theron Puño de Hierro')->first();

        $cards = [
            [
                'world_id' => $world->id,
                'character_id' => $elyndra?->id,
                'card_type_id' => $criaturaLegendaria->id,
                'rarity_id' => $legendaria->id,
                'alignment_id' => $luz->id,
                'faction_id' => $ordenLumendor->id,
                'archetype_id' => $mago->id,
                'artist_id' => Artist::where('name', 'María González')->first()->id,
                'name' => 'Elyndra, Fundadora de Lumendor',
                'effect' => '***Entrada al campo:*** Roba 2 cartas.
---
***Habilidad Activada:*** Una vez por turno, puedes buscar un hechizo de Luz en tu mazo y añadirlo a tu mano.
---
"La sabiduría no es poder, es comprensión. Y la comprensión es la verdadera magia."',
                'strength' => 2,
                'agility' => 3,
                'charisma' => 8,
                'mind' => 9,
                'cost' => 7,
                'edition' => 'Fundación',
                'flavor_text' => 'La primera y más grande de las archimagas.',
            ],
            [
                'world_id' => $world->id,
                'character_id' => $malachar?->id,
                'card_type_id' => $criaturaLegendaria->id,
                'rarity_id' => $legendaria->id,
                'alignment_id' => $oscuridad->id,
                'faction_id' => $casaUmbravale->id,
                'archetype_id' => $senorOscuro->id,
                'artist_id' => Artist::where('name', 'Carlos Mendoza')->first()->id,
                'name' => 'Malachar, Señor de la Oscuridad',
                'effect' => '***Pacto de Sangre:*** Cuando Malachar entre al campo, sacrifica una criatura. Si lo haces, obtiene +5/+5 hasta el fin del turno.
---
***Inmortal:*** Malachar no puede morir en combate. En su lugar, vuelve a tu mano.',
                'strength' => 8,
                'agility' => 4,
                'charisma' => 6,
                'mind' => 7,
                'cost' => 8,
                'edition' => 'Fundación',
                'flavor_text' => 'El poder tiene un precio. Él ya lo pagó.',
            ],
            [
                'world_id' => $world->id,
                'character_id' => $sylas?->id,
                'card_type_id' => $criaturaLegendaria->id,
                'rarity_id' => $legendaria->id,
                'alignment_id' => $neutral->id,
                'faction_id' => $sinFaccion->id,
                'archetype_id' => $errante->id,
                'artist_id' => Artist::where('name', 'Ana Rodríguez')->first()->id,
                'name' => 'Sylas, El Profeta Errante',
                'effect' => '***Visión de Futuros:*** Mira las 3 primeras cartas de tu mazo. Puedes reorganizarlas en cualquier orden.
---
***Paso Entre Mundos:*** Sylas no puede ser bloqueado.
---
"He visto mil futuros. En ninguno encuentro descanso."',
                'strength' => 3,
                'agility' => 7,
                'charisma' => 5,
                'mind' => 9,
                'cost' => 5,
                'edition' => 'Fundación',
                'flavor_text' => 'Condenado a caminar, destinado a advertir.',
            ],
            [
                'world_id' => $world->id,
                'character_id' => $lyra?->id,
                'card_type_id' => $criaturaLegendaria->id,
                'rarity_id' => $legendaria->id,
                'alignment_id' => $neutral->id,
                'faction_id' => $flotaTormenta->id,
                'archetype_id' => $pirata->id,
                'artist_id' => Artist::where('name', 'Pedro Sánchez')->first()->id,
                'name' => 'Lyra, Corazón de Tormenta',
                'effect' => '***Invocar Tormenta:*** Todas las criaturas voladoras obtienen +2/+2.
---
***Señora de los Mares:*** Tus criaturas con tipo "Marino" cuestan 2 menos de invocar.',
                'strength' => 6,
                'agility' => 8,
                'charisma' => 7,
                'mind' => 5,
                'cost' => 6,
                'edition' => 'Fundación',
                'flavor_text' => 'El mar es su hogar, la tormenta su aliada.',
            ],
            [
                'world_id' => $world->id,
                'character_id' => $theron?->id,
                'card_type_id' => $criaturaLegendaria->id,
                'rarity_id' => $legendaria->id,
                'alignment_id' => $luz->id,
                'faction_id' => $rebelionEsclavos->id,
                'archetype_id' => $guerrero->id,
                'artist_id' => Artist::where('name', 'Luis Martínez')->first()->id,
                'name' => 'Theron, Campeón del Coliseo',
                'effect' => '***Golpe Devastador:*** Cuando Theron ataca, puede luchar con una criatura objetivo adicional.
---
***Resistencia Férrea:*** Theron obtiene +1/+1 por cada criatura que controles.',
                'strength' => 9,
                'agility' => 6,
                'charisma' => 7,
                'mind' => 4,
                'cost' => 6,
                'edition' => 'Fundación',
                'flavor_text' => 'Cada cicatriz es una victoria. Cada victoria, un paso hacia la libertad.',
            ],
            [
                'world_id' => $world->id,
                'card_type_id' => $hechizo->id,
                'rarity_id' => $rara->id,
                'alignment_id' => $luz->id,
                'faction_id' => $ordenLumendor->id,
                'archetype_id' => null,
                'artist_id' => Artist::where('name', 'Elena Torres')->first()->id,
                'character_id' => null,
                'name' => 'Rayo de Luz Sagrada',
                'effect' => '***Destruir Oscuridad:*** Destruye una criatura objetivo con alineación Oscuridad.
---
Roba una carta.',
                'strength' => null,
                'agility' => null,
                'charisma' => null,
                'mind' => null,
                'cost' => 3,
                'edition' => 'Fundación',
                'flavor_text' => 'La luz no conoce sombra que no pueda disipar.',
            ],
            [
                'world_id' => $world->id,
                'card_type_id' => $hechizo->id,
                'rarity_id' => $epica->id,
                'alignment_id' => $oscuridad->id,
                'faction_id' => $casaUmbravale->id,
                'archetype_id' => null,
                'artist_id' => Artist::where('name', 'Ricardo Gómez')->first()->id,
                'character_id' => null,
                'name' => 'Cosecha de Almas',
                'effect' => '***Sacrificio:*** Sacrifica cualquier número de criaturas que controles. Por cada una, roba una carta y ganas 2 puntos de vida.
---
"Un precio pequeño por poder eterno."',
                'strength' => null,
                'agility' => null,
                'charisma' => null,
                'mind' => null,
                'cost' => 5,
                'edition' => 'Fundación',
                'flavor_text' => 'El alma es solo energía esperando ser aprovechada.',
            ],
            [
                'world_id' => $world->id,
                'card_type_id' => $criatura->id,
                'rarity_id' => $comun->id,
                'alignment_id' => $neutral->id,
                'faction_id' => $ordenLumendor->id,
                'archetype_id' => $constructo->id,
                'artist_id' => Artist::where('name', 'Sofía Ramírez')->first()->id,
                'character_id' => null,
                'name' => 'Guardián de Cristal',
                'effect' => '***Defensor:*** Esta criatura debe bloquear si es posible.
---
***Escudo Mágico:*** Previene los primeros 3 puntos de daño que recibiría.',
                'strength' => 4,
                'agility' => 2,
                'charisma' => 1,
                'mind' => 5,
                'cost' => 4,
                'edition' => 'Fundación',
                'flavor_text' => 'Los cristales de Aethermoor guardan secretos antiguos.',
            ],
            [
                'world_id' => $world->id,
                'card_type_id' => $criatura->id,
                'rarity_id' => $comun->id,
                'alignment_id' => $neutral->id,
                'faction_id' => $circuloDruidico->id,
                'archetype_id' => $bestia->id,
                'artist_id' => Artist::where('name', 'Miguel Herrera')->first()->id,
                'character_id' => null,
                'name' => 'Lobo Sombrío',
                'effect' => '***Cazador Nocturno:*** Obtiene +2/+0 durante tu turno.
---
***Manada:*** Por cada otro Lobo que controles, esta criatura obtiene +1/+1.',
                'strength' => 3,
                'agility' => 6,
                'charisma' => 2,
                'mind' => 2,
                'cost' => 3,
                'edition' => 'Fundación',
                'flavor_text' => 'El bosque tiene ojos, y todos ellos te observan.',
            ],
            [
                'world_id' => $world->id,
                'card_type_id' => $hechizo->id,
                'rarity_id' => $epica->id,
                'alignment_id' => $neutral->id,
                'faction_id' => $flotaTormenta->id,
                'archetype_id' => null,
                'artist_id' => Artist::where('name', 'Laura Díaz')->first()->id,
                'character_id' => null,
                'name' => 'Maremoto',
                'effect' => '***Devastación Marina:*** Destruye todas las criaturas que no sean de tipo Marino.
---
Los jugadores descartan su mano y roban 5 cartas.',
                'strength' => null,
                'agility' => null,
                'charisma' => null,
                'mind' => null,
                'cost' => 9,
                'edition' => 'Fundación',
                'flavor_text' => 'Cuando el mar se enfurece, todos somos iguales ante su poder.',
            ],
        ];

        foreach ($cards as $card) {
            Card::create($card);
        }
    }
}
