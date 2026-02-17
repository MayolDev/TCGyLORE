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
        // Primero, cambiar el tipo de columna a VARCHAR para permitir más valores
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE locations MODIFY COLUMN location_type VARCHAR(50)");
        } else {
            // SQLite workaround: Recreate table to remove ENUM constraint
            Schema::create('locations_temp', function (Blueprint $table) {
                $table->id();
                $table->foreignId('world_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->text('description');
                $table->string('location_type', 50);
                $table->decimal('coordinate_x', 8, 2)->nullable();
                $table->decimal('coordinate_y', 8, 2)->nullable();
                $table->string('image')->nullable();
                $table->boolean('is_discovered')->default(true);
                $table->timestamps();
            });

            // Disable foreign keys to avoid issues during swap
            DB::statement('PRAGMA foreign_keys=OFF');

            // Copy data
            DB::statement('INSERT INTO locations_temp SELECT * FROM locations');

            Schema::drop('locations');
            Schema::rename('locations_temp', 'locations');

            DB::statement('PRAGMA foreign_keys=ON');
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
