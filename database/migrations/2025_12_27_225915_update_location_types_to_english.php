<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // En SQLite, ALTER TABLE MODIFY no está soportado de la misma manera que en MySQL.
        // Como 'location_type' probablemente ya es un string (varchar o text en SQLite),
        // y SQLite es tipado dinámicamente, podemos omitir el MODIFY COLUMN si estamos en SQLite.

        // Si no es SQLite, intentamos ejecutar el modify.
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE locations MODIFY COLUMN location_type VARCHAR(50)");
        }

        // Mapeo de valores antiguos (español) a nuevos (inglés)
        $typeMapping = [
            'ciudad' => 'city',
            'bosque' => 'forest',
            'mazmorra' => 'dungeon',
            'reino' => 'castle',
            'montaña' => 'mountain',
            'mar' => 'port',
            'templo' => 'temple',
            'ruina' => 'ruins',
        ];

        foreach ($typeMapping as $oldType => $newType) {
            DB::table('locations')
                ->where('location_type', $oldType)
                ->update(['location_type' => $newType]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir a español
        $typeMapping = [
            'city' => 'ciudad',
            'forest' => 'bosque',
            'dungeon' => 'mazmorra',
            'castle' => 'reino',
            'mountain' => 'montaña',
            'port' => 'mar',
            'temple' => 'templo',
            'ruins' => 'ruina',
        ];

        foreach ($typeMapping as $oldType => $newType) {
            DB::table('locations')
                ->where('location_type', $oldType)
                ->update(['location_type' => $newType]);
        }
    }
};
