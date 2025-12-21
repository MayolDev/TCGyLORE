<?php

namespace Database\Seeders;

use App\Models\Character;
use App\Models\Location;
use App\Models\Story;
use Illuminate\Database\Seeder;

class CharacterRelationshipsSeeder extends Seeder
{
    public function run(): void
    {
        // Relaciones Character <-> Location
        $elyndra = Character::where('name', 'Elyndra la Sabia')->first();
        $malachar = Character::where('name', 'Malachar el Maldito')->first();
        $sylas = Character::where('name', 'Sylas el Errante')->first();
        $lyra = Character::where('name', 'Lyra Corazón de Tormenta')->first();
        $theron = Character::where('name', 'Theron Puño de Hierro')->first();
        $morgana = Character::where('name', 'Morgana Tejealmas')->first();
        $valorian = Character::where('name', 'Valorian el Justo')->first();

        $lumendor = Location::where('name', 'Lumendor')->first();
        $umbravale = Location::where('name', 'Umbravale')->first();
        $bosqueSombrio = Location::where('name', 'Bosque Sombrío')->first();
        $puertoTormenta = Location::where('name', 'Puerto Tormenta')->first();
        $fortalezaFerrea = Location::where('name', 'Fortaleza Férrea')->first();

        // Elyndra está relacionada con Lumendor
        if ($elyndra && $lumendor) {
            $elyndra->locations()->syncWithoutDetaching([$lumendor->id]);
        }

        // Malachar está relacionado con Umbravale
        if ($malachar && $umbravale) {
            $malachar->locations()->syncWithoutDetaching([$umbravale->id]);
        }

        // Sylas es errante, ha estado en múltiples lugares
        if ($sylas) {
            $locations = array_filter([
                $lumendor?->id,
                $umbravale?->id,
                $bosqueSombrio?->id,
                $puertoTormenta?->id,
            ]);
            if (!empty($locations)) {
                $sylas->locations()->syncWithoutDetaching($locations);
            }
        }

        // Lyra está relacionada con Puerto Tormenta
        if ($lyra && $puertoTormenta) {
            $lyra->locations()->syncWithoutDetaching([$puertoTormenta->id]);
        }

        // Theron está en Fortaleza Férrea
        if ($theron && $fortalezaFerrea) {
            $theron->locations()->syncWithoutDetaching([$fortalezaFerrea->id]);
        }

        // Morgana está en el Bosque Sombrío
        if ($morgana && $bosqueSombrio) {
            $morgana->locations()->syncWithoutDetaching([$bosqueSombrio->id]);
        }

        // Valorian está en Lumendor
        if ($valorian && $lumendor) {
            $valorian->locations()->syncWithoutDetaching([$lumendor->id]);
        }

        // Relaciones Character <-> Story
        $fundacionStory = Story::where('title', 'La Fundación de Lumendor')->first();
        $maldicionStory = Story::where('title', 'La Maldición de Umbravale')->first();
        $profeciaStory = Story::where('title', 'La Profecía del Errante')->first();
        $tormentaStory = Story::where('title', 'La Tormenta que Despertó')->first();

        // Elyndra protagoniza la fundación de Lumendor
        if ($elyndra && $fundacionStory) {
            $elyndra->stories()->syncWithoutDetaching([$fundacionStory->id]);
        }

        // Malachar protagoniza la maldición de Umbravale
        if ($malachar && $maldicionStory) {
            $malachar->stories()->syncWithoutDetaching([$maldicionStory->id]);
        }

        // Sylas protagoniza la profecía
        if ($sylas && $profeciaStory) {
            $sylas->stories()->syncWithoutDetaching([$profeciaStory->id]);
        }

        // Lyra protagoniza la historia de la tormenta
        if ($lyra && $tormentaStory) {
            $lyra->stories()->syncWithoutDetaching([$tormentaStory->id]);
        }

        // Theron y Valorian también están en la profecía (como personajes secundarios)
        if ($profeciaStory) {
            if ($theron) {
                $theron->stories()->syncWithoutDetaching([$profeciaStory->id]);
            }
            if ($valorian) {
                $valorian->stories()->syncWithoutDetaching([$profeciaStory->id]);
            }
        }

        // Morgana aparece en la historia de la maldición y el bosque sombrío
        if ($morgana && $maldicionStory) {
            $morgana->stories()->syncWithoutDetaching([$maldicionStory->id]);
        }
    }
}
