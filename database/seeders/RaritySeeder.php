<?php

namespace Database\Seeders;

use App\Models\Rarity;
use Illuminate\Database\Seeder;

class RaritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rarities = [
            [
                'name' => 'Común',
                'description' => 'Cartas comunes y fáciles de obtener',
            ],
            [
                'name' => 'Rara',
                'description' => 'Cartas poco comunes con habilidades especiales',
            ],
            [
                'name' => 'Épica',
                'description' => 'Cartas poderosas con habilidades únicas',
            ],
            [
                'name' => 'Legendaria',
                'description' => 'Cartas extremadamente raras y poderosas',
            ],
        ];

        foreach ($rarities as $rarity) {
            Rarity::firstOrCreate(
                ['name' => $rarity['name']],
                $rarity
            );
        }
    }
}
