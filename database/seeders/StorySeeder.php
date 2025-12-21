<?php

namespace Database\Seeders;

use App\Models\Story;
use App\Models\World;
use Illuminate\Database\Seeder;

class StorySeeder extends Seeder
{
    public function run(): void
    {
        $world = World::first();

        $stories = [
            [
                'title' => 'La Fundación de Lumendor',
                'slug' => 'la-fundacion-de-lumendor',
                'content' => 'Hace mil años, cuando las tierras de Aethermoor aún eran salvajes y sin ley, un grupo de magos liderados por la sabia Elyndra decidieron crear un bastión de luz y conocimiento. En lo alto de las Montañas de Cristal, donde la magia fluía más pura, fundaron Lumendor, la Ciudad de la Luz Eterna.

La construcción tomó décadas. Los magos canalizaron el poder de las venas de cristal etéreo para crear muros que brillaban con luz propia, torres que tocaban las nubes, y una gran biblioteca que contendría todo el conocimiento del mundo.

Elyndra, en su lecho de muerte, pronunció una profecía: "Mientras la luz de Lumendor brille, la oscuridad no prevalecerá. Pero cuidado, pues hasta la luz más brillante puede proyectar las sombras más oscuras."',
                'category' => 'leyenda',
                'era' => 'Era de la Fundación',
                'order' => 1,
                'is_published' => true,
            ],
            [
                'title' => 'El Pacto de Sangre de Umbravale',
                'slug' => 'el-pacto-de-sangre-de-umbravale',
                'content' => 'En el año 547 de la Era Oscura, cuando la hambruna azotaba las tierras del norte, el Señor Malachar de Umbravale tomó una decisión que cambiaría el destino de su pueblo para siempre.

Desesperado por salvar a su gente, Malachar invocó a los antiguos dioses oscuros en el corazón del Bosque de las Lamentaciones. Le ofrecieron un pacto: poder ilimitado a cambio de servir a la oscuridad eternamente.

Malachar aceptó, y esa noche su sangre se tornó negra como la obsidiana. Con su nuevo poder, transformó las tierras estériles en campos fértiles, pero a un terrible precio: cada cosecha requería un sacrificio humano. Así nació la maldición de Umbravale, una maldición que perdura hasta nuestros días.',
                'category' => 'cronica',
                'era' => 'Era Oscura',
                'order' => 2,
                'is_published' => true,
            ],
            [
                'title' => 'La Leyenda de Sylas el Errante',
                'slug' => 'la-leyenda-de-sylas-el-errante',
                'content' => 'Sylas no nació con magia, ni con espada en mano. Era simplemente un huérfano de las calles de Puerto Tormenta, sobreviviendo día a día con astucia y rapidez.

Todo cambió la noche que encontró el Orbe de los Mil Caminos en las ruinas de un antiguo templo. El orbe le otorgó el poder de ver todos los futuros posibles, pero le arrebató su capacidad de permanecer en un solo lugar.

Condenado a vagar eternamente, Sylas se convirtió en leyenda. Aparece cuando el destino debe cambiar, siempre en el momento justo, con la advertencia precisa. Algunos lo llaman profeta, otros lo llaman maldito. Sylas solo se llama a sí mismo "el que camina entre mundos que nunca fueron."',
                'category' => 'biografia',
                'era' => 'Era de los Héroes',
                'order' => 3,
                'is_published' => true,
            ],
            [
                'title' => 'El Despertar de los Titanes de Roca',
                'slug' => 'el-despertar-de-los-titanes-de-roca',
                'content' => 'Cuenta la leyenda que las Montañas de Hierro no siempre fueron montañas. En los albores del mundo, eran guerreros gigantes de piedra viviente, los Titanes de Roca, creados por los Primigenios para proteger la tierra.

Durante la Guerra de los Dioses, los titanes lucharon valientemente, pero fueron derrotados. Como castigo, fueron transformados en montañas, condenados a dormir eternamente mientras el mundo cambiaba a su alrededor.

Pero las profecías hablan de su despertar. Cuando la tierra tiemble y las montañas se agrieten, cuando el equilibrio entre luz y oscuridad penda de un hilo, los Titanes de Roca despertarán una vez más. Y ese día, decidirán si el mundo merece ser salvado... o destruido.',
                'category' => 'mito',
                'era' => 'Era Primigenia',
                'order' => 4,
                'is_published' => true,
            ],
            [
                'title' => 'Los Susurros del Bosque Sombrío',
                'slug' => 'los-susurros-del-bosque-sombrio',
                'content' => 'Ningún cazador que entre al Bosque Sombrío regresa siendo el mismo. Algunos dicen que es el hogar de espíritus ancestrales, otros que es un portal a otro plano de existencia.

La verdad es más extraña aún. El Bosque Sombrío es consciente. Cada árbol, cada arbusto, cada brizna de hierba está conectada a una única mente antigua. El bosque observa, aprende, y a veces... habla.

Los druidas que han aprendido a escuchar sus susurros han obtenido conocimiento prohibido. Pero el bosque no regala nada sin pedir algo a cambio. Y lo que pide siempre es un secreto: algo que nunca le hayas contado a nadie, algo que defina quién eres. A cambio, te muestra quién podrías ser.',
                'category' => 'cuento',
                'era' => 'Era Actual',
                'order' => 5,
                'is_published' => true,
            ],
        ];

        foreach ($stories as $story) {
            Story::create(array_merge($story, ['world_id' => $world->id]));
        }
    }
}
