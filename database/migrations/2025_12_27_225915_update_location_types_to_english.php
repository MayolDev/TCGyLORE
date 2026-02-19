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
        if (DB::getDriverName() === 'sqlite') {
            // Workaround for SQLite to change column type and remove enum constraint
            Schema::create('locations_temp', function (Blueprint $table) {
                $table->id();
                $table->foreignId('world_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->text('description');
                $table->string('location_type', 50)->default('city');
                $table->decimal('coordinate_x', 8, 2)->nullable();
                $table->decimal('coordinate_y', 8, 2)->nullable();
                $table->string('image')->nullable();
                $table->boolean('is_discovered')->default(true);
                $table->timestamps();
            });

            // Copy data
            DB::statement('INSERT INTO locations_temp (id, world_id, name, description, location_type, coordinate_x, coordinate_y, image, is_discovered, created_at, updated_at) SELECT id, world_id, name, description, location_type, coordinate_x, coordinate_y, image, is_discovered, created_at, updated_at FROM locations');

            Schema::drop('locations');
            Schema::rename('locations_temp', 'locations');
        } else {
            // Primero, cambiar el tipo de columna a VARCHAR para permitir más valores
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

        // Note: Reverting the schema change (string -> enum) is complicated in SQLite too
        // and usually not strictly required for 'down' in dev/test environments unless fully strict.
        // For MySQL we could do: ALTER TABLE locations MODIFY COLUMN location_type ENUM(...)
        // But for now we just revert the data values.
    }
};
