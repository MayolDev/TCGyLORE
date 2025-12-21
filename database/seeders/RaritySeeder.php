<?php

namespace Database\Seeders;

use App\Models\Rarity;
use Illuminate\Database\Seeder;

class RaritySeeder extends Seeder
{
    public function run(): void
    {
        $rarities = [
            ['name' => 'Común', 'color' => '#9CA3AF', 'order' => 1],
            ['name' => 'Rara', 'color' => '#3B82F6', 'order' => 2],
            ['name' => 'Épica', 'color' => '#A855F7', 'order' => 3],
            ['name' => 'Legendaria', 'color' => '#F59E0B', 'order' => 4],
            ['name' => 'Mítica', 'color' => '#EF4444', 'order' => 5],
        ];

        foreach ($rarities as $rarity) {
            Rarity::create($rarity);
        }
    }
}
