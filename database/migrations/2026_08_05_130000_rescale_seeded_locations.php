<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Segunda pasada del reescalado de coordenadas legado.
 *
 * normalize_location_data solo reescalaba si TODA la tabla estaba en escala
 * 0-100, para no tocar ubicaciones colocadas a mano. En produccion habia una
 * ubicacion ya recolocada con el mapa (coordenadas > 100), asi que la guarda
 * salto y las nueve filas del seeder quedaron apinadas en la esquina.
 *
 * Aqui se reescalan SOLO las filas cuyas coordenadas coinciden exactamente con
 * las tuplas que sembraba el LocationSeeder antiguo: una huella de dos
 * decimales que no puede corresponder a nada colocado a mano. La ubicacion
 * editada no coincide con ninguna tupla y no se toca.
 */
return new class extends Migration
{
    public function up(): void
    {
        $tuplasDelSeeder = [
            [45.50, 30.25],
            [20.75, 15.80],
            [70.30, 60.90],
            [55.20, 45.70],
            [30.40, 35.15],
            [35.60, 40.50],
            [60.80, 70.20],
            [50.25, 20.60],
            [75.00, 55.30],
            [40.15, 25.85],
        ];

        foreach ($tuplasDelSeeder as [$x, $y]) {
            DB::table('locations')
                ->where('coordinate_x', $x)
                ->where('coordinate_y', $y)
                ->update([
                    'coordinate_x' => round($x * 15.36),
                    'coordinate_y' => round($y * 7.54),
                ]);
        }
    }

    public function down(): void
    {
        // Normalizacion de datos: sin vuelta atras.
    }
};
