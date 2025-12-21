<?php

namespace Database\Seeders;

use App\Models\CardType;
use Illuminate\Database\Seeder;

class CardTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Criatura', 'description' => 'Cartas que representan criaturas del mundo'],
            ['name' => 'Criatura Legendaria', 'description' => 'Criaturas únicas y poderosas con habilidades especiales'],
            ['name' => 'Hechizo', 'description' => 'Magia instantánea o de invocación'],
            ['name' => 'Hechizo Instantáneo', 'description' => 'Hechizos que pueden jugarse en cualquier momento'],
            ['name' => 'Artefacto', 'description' => 'Objetos mágicos permanentes'],
            ['name' => 'Artefacto - Equipo', 'description' => 'Equipamiento que se puede colocar en criaturas'],
            ['name' => 'Artefacto Legendario', 'description' => 'Artefactos únicos de gran poder'],
            ['name' => 'Encantamiento', 'description' => 'Efectos mágicos permanentes'],
            ['name' => 'Tierra', 'description' => 'Fuentes de maná y recursos'],
            ['name' => 'Tierra Legendaria', 'description' => 'Ubicaciones únicas con habilidades especiales'],
            ['name' => 'Trampa', 'description' => 'Cartas que se activan bajo condiciones específicas'],
            ['name' => 'Evento', 'description' => 'Acontecimientos que afectan el campo de batalla'],
        ];

        foreach ($types as $type) {
            CardType::create($type);
        }
    }
}
