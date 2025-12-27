<?php

namespace Database\Seeders;

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Character;
use App\Models\Edition;
use App\Models\Rarity;
use App\Models\World;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        // Obtener personajes para asociar algunas cartas
        $elyndra = Character::where('name', 'Elyndra la Sabia')->first();
        $malachar = Character::where('name', 'Malachar el Maldito')->first();
        $sylas = Character::where('name', 'Sylas el Errante')->first();
        $lyra = Character::where('name', 'Lyra Corazón de Tormenta')->first();
        $theron = Character::where('name', 'Theron Puño de Hierro')->first();
        $morgana = Character::where('name', 'Morgana Tejealmas')->first();
        $valorian = Character::where('name', 'Valorian el Justo')->first();

        // Obtener IDs de taxonomías
        $criaturaType = CardType::where('name', 'Criatura')->first();
        $hechizoType = CardType::where('name', 'Hechizo')->first();
        $artefactoType = CardType::where('name', 'Artefacto')->first();

        $comunRarity = Rarity::where('name', 'Común')->first();
        $raraRarity = Rarity::where('name', 'Rara')->first();
        $epicaRarity = Rarity::where('name', 'Épica')->first();
        $legendariaRarity = Rarity::where('name', 'Legendaria')->first();

        $luzAlignment = Alignment::where('name', 'Luz')->first();
        $oscuridadAlignment = Alignment::where('name', 'Oscuridad')->first();
        $neutralAlignment = Alignment::where('name', 'Neutral')->first();

        // Obtener arquetipos (crear algunos si no existen en los seeders)
        $magoArchetype = Archetype::firstOrCreate(['name' => 'Mago']);
        $guerreroArchetype = Archetype::firstOrCreate(['name' => 'Guerrero']);
        $picahoArchetype = Archetype::firstOrCreate(['name' => 'Pícaro']);

        // Obtener artistas
        $artist1 = Artist::first();

        // Obtener edición
        $edicion = Edition::first();

        $cards = [
            [
                'character_id' => $elyndra?->id,
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
                'defense' => 4,
                'magic_defense' => 7,
                'cost' => 7,
                'card_type_id' => $criaturaType?->id,
                'rarity_id' => $legendariaRarity?->id,
                'archetype_id' => $magoArchetype?->id,
                'alignment_id' => $luzAlignment?->id,
                'faction_id' => null,
                'edition_id' => $edicion?->id,
                'artist_id' => $artist1?->id,
                'flavor_text' => 'La primera y más grande de las archimagas.',
            ],
            [
                'character_id' => $malachar?->id,
                'name' => 'Malachar, Señor de la Oscuridad',
                'effect' => '***Pacto de Sangre:*** Cuando Malachar entre al campo, sacrifica una criatura. Si lo haces, obtiene +5/+5 hasta el fin del turno.
---
***Inmortal:*** Malachar no puede morir en combate. En su lugar, vuelve a tu mano.',
                'strength' => 8,
                'agility' => 4,
                'charisma' => 6,
                'mind' => 7,
                'defense' => 6,
                'magic_defense' => 8,
                'cost' => 8,
                'card_type_id' => $criaturaType?->id,
                'rarity_id' => $legendariaRarity?->id,
                'archetype_id' => $magoArchetype?->id,
                'alignment_id' => $oscuridadAlignment?->id,
                'faction_id' => null,
                'edition_id' => $edicion?->id,
                'artist_id' => $artist1?->id,
                'flavor_text' => 'El poder tiene un precio. Él ya lo pagó.',
            ],
            [
                'character_id' => $theron?->id,
                'name' => 'Theron, Campeón del Coliseo',
                'effect' => '***Golpe Devastador:*** Cuando Theron ataca, puede luchar con una criatura objetivo adicional.
---
***Resistencia Férrea:*** Theron obtiene +1/+1 por cada criatura que controles.',
                'strength' => 9,
                'agility' => 6,
                'charisma' => 7,
                'mind' => 4,
                'defense' => 8,
                'magic_defense' => 3,
                'cost' => 6,
                'card_type_id' => $criaturaType?->id,
                'rarity_id' => $legendariaRarity?->id,
                'archetype_id' => $guerreroArchetype?->id,
                'alignment_id' => $luzAlignment?->id,
                'faction_id' => null,
                'edition_id' => $edicion?->id,
                'artist_id' => $artist1?->id,
                'flavor_text' => 'Cada cicatriz es una victoria. Cada victoria, un paso hacia la libertad.',
            ],
            [
                'name' => 'Rayo de Luz Sagrada',
                'effect' => '***Destruir Oscuridad:*** Destruye una criatura objetivo con alineación Oscuridad.
---
Roba una carta.',
                'strength' => null,
                'agility' => null,
                'charisma' => null,
                'mind' => null,
                'defense' => null,
                'magic_defense' => null,
                'cost' => 3,
                'card_type_id' => $hechizoType?->id,
                'rarity_id' => $raraRarity?->id,
                'archetype_id' => null,
                'alignment_id' => $luzAlignment?->id,
                'faction_id' => null,
                'edition_id' => $edicion?->id,
                'artist_id' => $artist1?->id,
                'flavor_text' => 'La luz no conoce sombra que no pueda disipar.',
            ],
            [
                'name' => 'Guardián de Cristal',
                'effect' => '***Defensor:*** Esta criatura debe bloquear si es posible.
---
***Escudo Mágico:*** Previene los primeros 3 puntos de daño que recibiría.',
                'strength' => 4,
                'agility' => 2,
                'charisma' => 1,
                'mind' => 5,
                'defense' => 7,
                'magic_defense' => 6,
                'cost' => 4,
                'card_type_id' => $criaturaType?->id,
                'rarity_id' => $comunRarity?->id,
                'archetype_id' => null,
                'alignment_id' => $neutralAlignment?->id,
                'faction_id' => null,
                'edition_id' => $edicion?->id,
                'artist_id' => $artist1?->id,
                'flavor_text' => 'Los cristales de Aethermoor guardan secretos antiguos.',
            ],
        ];

        foreach ($cards as $card) {
            Card::create(array_merge($card, ['world_id' => $world->id]));
        }
    }
}
