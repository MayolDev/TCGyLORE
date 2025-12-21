<?php

namespace Database\Seeders;

use App\Models\Character;
use App\Models\World;
use Illuminate\Database\Seeder;

class CharacterSeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        $characters = [
            [
                'name' => 'Elyndra la Sabia',
                'title' => 'Fundadora de Lumendor',
                'biography' => 'Primera Archimaga de Lumendor y fundadora de la ciudad de luz. Elyndra dedicó su vida al estudio de la magia arcana y a la creación de un refugio para todos aquellos que buscaban conocimiento. Sus últimas palabras fueron una profecía que aún resuena en los corazones de los magos de Aethermoor.',
                'spells' => 'Luz Eterna, Escudo de Cristal, Visión Profética, Curación Radiante',
                'faction' => 'Orden de Lumendor',
                'alignment' => 'luz',
            ],
            [
                'name' => 'Malachar el Maldito',
                'title' => 'Señor de Umbravale',
                'biography' => 'En su desesperación por salvar a su pueblo, Malachar hizo un pacto con fuerzas oscuras que lo transformó para siempre. Ahora, inmortal y atormentado, gobierna Umbravale con mano de hierro, perpetuando la maldición que él mismo invocó. Algunos dicen que en lo profundo de su corazón negro aún late un deseo de redención.',
                'spells' => 'Pacto de Sangre, Cosecha de Almas, Neblina Oscura, Regeneración Maldita',
                'faction' => 'Casa Umbravale',
                'alignment' => 'oscuridad',
            ],
            [
                'name' => 'Sylas el Errante',
                'title' => 'El que Camina entre Mundos',
                'biography' => 'Portador del Orbe de los Mil Caminos, Sylas está condenado a vagar eternamente, viendo todos los futuros posibles pero incapaz de elegir uno propio. Aparece en momentos cruciales de la historia, ofreciendo advertencias crípticas que han salvado reinos enteros... o los han condenado.',
                'spells' => 'Visión de Futuros, Paso Entre Mundos, Eco Temporal, Paradoja',
                'faction' => 'Ninguna - Errante',
                'alignment' => 'neutral',
            ],
            [
                'name' => 'Lyra Corazón de Tormenta',
                'title' => 'Capitana de los Mares',
                'biography' => 'La pirata más temida de Puerto Tormenta, Lyra controla una flota que domina las aguas del sur. Con el poder de invocar tormentas y comunicarse con las criaturas marinas, es una fuerza de la naturaleza con la que pocos se atreven a cruzarse. Dicen que busca un tesoro perdido que podría cambiar el equilibrio de poder en Aethermoor.',
                'spells' => 'Invocar Tormenta, Respiración Acuática, Lengua Marina, Maremoto',
                'faction' => 'Flota de la Tormenta',
                'alignment' => 'neutral',
            ],
            [
                'name' => 'Theron Puño de Hierro',
                'title' => 'Campeón del Coliseo',
                'biography' => 'Gladiador invicto del Gran Coliseo de Fortaleza Férrea. Theron no conoce la magia, pero su fuerza y habilidad con las armas son legendarias. Cada cicatriz en su cuerpo cuenta la historia de una victoria. Lucha no por gloria, sino para ganar su libertad y la de todos los esclavos del coliseo.',
                'spells' => 'Golpe Devastador, Resistencia Férrea, Grito de Guerra, Segunda Oportunidad',
                'faction' => 'Rebelión de Esclavos',
                'alignment' => 'luz',
            ],
            [
                'name' => 'Morgana Tejealmas',
                'title' => 'Bruja del Bosque Sombrío',
                'biography' => 'Morgana ha vivido en el Bosque Sombrío durante siglos, convirtiéndose en parte de él. Puede hablar con los árboles, ver a través de los ojos de los animales, y manipular las sombras mismas. Los viajeros que se pierden en el bosque a veces encuentran su cabaña... y aquellos que la encuentran rara vez regresan sin cambios.',
                'spells' => 'Hablar con la Naturaleza, Transformación Animal, Maldición de Sombras, Curación Natural',
                'faction' => 'Círculo Druídico',
                'alignment' => 'neutral',
            ],
            [
                'name' => 'Valorian el Justo',
                'title' => 'Paladín de la Luz',
                'biography' => 'Líder de la Orden de la Luz Sagrada, Valorian ha dedicado su vida a combatir la oscuridad dondequiera que la encuentre. Su fe es inquebrantable, su espada santa nunca yerra, y su armadura brilla con luz divina. Pero su rigidez moral y su falta de compasión por aquellos que considera "caídos" lo han hecho tan temido como respetado.',
                'spells' => 'Juicio Divino, Aura Sagrada, Resurrección, Castigo Celestial',
                'faction' => 'Orden de la Luz Sagrada',
                'alignment' => 'luz',
            ],
        ];

        foreach ($characters as $character) {
            Character::create(array_merge($character, ['world_id' => $world->id]));
        }
    }
}
