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
        // En SQLite, ALTER TABLE MODIFY no está soportado.
        // Además, los CHECK constraints en SQLite no se pueden modificar fácilmente.
        // La mejor opción para SQLite es recrear la tabla o ignorar la restricción si solo es un cambio de datos.

        if (DB::getDriverName() === 'sqlite') {
            // Deshabilitar foreign keys para permitir la recreación
            Schema::disableForeignKeyConstraints();

            // 1. Crear nueva tabla temporal con la nueva estructura (varchar en lugar de enum restrictivo)
            Schema::create('locations_temp', function (Blueprint $table) {
                $table->id();
                $table->foreignId('world_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->text('description');
                // Usamos string para permitir cualquier valor por ahora
                $table->string('location_type', 50)->default('city');
                $table->decimal('coordinate_x', 8, 2)->nullable();
                $table->decimal('coordinate_y', 8, 2)->nullable();
                $table->string('image')->nullable();
                $table->boolean('is_discovered')->default(true);
                $table->timestamps();
            });

            // 2. Copiar datos
            $oldLocations = DB::table('locations')->get();
            foreach ($oldLocations as $loc) {
                DB::table('locations_temp')->insert((array)$loc);
            }

            // 3. Eliminar tabla vieja
            Schema::drop('locations');

            // 4. Renombrar tabla nueva
            Schema::rename('locations_temp', 'locations');

            Schema::enableForeignKeyConstraints();
        } else {
            // MySQL/Postgres
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
