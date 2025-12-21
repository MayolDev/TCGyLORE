<?php

namespace Database\Seeders;

use App\Models\World;
use Illuminate\Database\Seeder;

class WorldSeeder extends Seeder
{
    public function run(): void
    {
        World::create([
            'name' => 'Aethermoor',
            'description' => 'Un vasto continente donde la magia fluye a través de venas de cristal etéreo bajo la tierra. Aethermoor está dividido entre cinco grandes reinos que han conocido siglos de guerra y paz. La magia aquí no es solo una herramienta, sino una fuerza viva que moldea el destino de todos sus habitantes. Antiguas profecías hablan de un equilibrio que debe mantenerse entre la Luz y la Oscuridad, o el mundo mismo se desgarrará.',
            'is_active' => true,
        ]);
    }
}
