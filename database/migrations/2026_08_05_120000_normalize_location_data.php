<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Normaliza los datos de `locations` sembrados con el sistema antiguo.
 *
 * Dos defectos venian del seeder:
 * 1. Tipos en espanol ("ciudad", "bosque"...) cuando el mapa indexa por claves
 *    inglesas (LOCATION_TYPES en map-view.tsx). La migracion
 *    update_location_types_to_english corria sobre la tabla vacia y el seeder
 *    volvia a sembrar en espanol: todos los marcadores caian al icono generico.
 * 2. Coordenadas en escala 0-100 cuando el lienzo del mapa es 0-1536 x 0-754:
 *    las diez ubicaciones se apinaban en la esquina superior izquierda.
 *
 * El reescalado solo se aplica si TODA la tabla esta en escala legado (maximos
 * <= 100): si alguien ya coloco una ubicacion con coordenadas reales, no se
 * toca nada.
 */
return new class extends Migration
{
    public function up(): void
    {
        $traducciones = [
            'ciudad' => 'city',
            'aldea' => 'village',
            'castillo' => 'castle',
            'bosque' => 'forest',
            'montaña' => 'mountain',
            'montana' => 'mountain',
            'mazmorra' => 'dungeon',
            'ruina' => 'ruins',
            'ruinas' => 'ruins',
            'mar' => 'port',
            'puerto' => 'port',
            'templo' => 'temple',
            'cueva' => 'cave',
            'torre' => 'tower',
            'campo de batalla' => 'battlefield',
        ];

        foreach ($traducciones as $espanol => $ingles) {
            DB::table('locations')->where('location_type', $espanol)->update(['location_type' => $ingles]);
        }

        $maximos = DB::table('locations')
            ->whereNotNull('coordinate_x')
            ->whereNotNull('coordinate_y')
            ->selectRaw('MAX(coordinate_x) AS mx, MAX(coordinate_y) AS my')
            ->first();

        if ($maximos && $maximos->mx !== null && $maximos->mx <= 100 && $maximos->my <= 100) {
            DB::table('locations')
                ->whereNotNull('coordinate_x')
                ->whereNotNull('coordinate_y')
                ->update([
                    'coordinate_x' => DB::raw('ROUND(coordinate_x * 15.36)'),
                    'coordinate_y' => DB::raw('ROUND(coordinate_y * 7.54)'),
                ]);
        }
    }

    public function down(): void
    {
        // Normalizacion de datos: no hay vuelta atras fiable ni necesaria.
    }
};
