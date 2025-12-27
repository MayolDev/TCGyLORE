<?php

namespace Database\Seeders;

use App\Models\CardType;
use Illuminate\Database\Seeder;

class CardTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cardTypes = [
            [
                'name' => 'Criatura',
                'description' => 'Unidades que pueden atacar y defender',
            ],
            [
                'name' => 'Hechizo',
                'description' => 'Efectos instantáneos o permanentes',
            ],
            [
                'name' => 'Artefacto',
                'description' => 'Objetos mágicos permanentes',
            ],
            [
                'name' => 'Encantamiento',
                'description' => 'Efectos continuos que modifican el juego',
            ],
            [
                'name' => 'Tierra',
                'description' => 'Cartas que generan recursos',
            ],
        ];

        foreach ($cardTypes as $cardType) {
            CardType::firstOrCreate(
                ['name' => $cardType['name']],
                $cardType
            );
        }
    }
}
