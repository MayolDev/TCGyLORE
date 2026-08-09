<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Historias, personajes y eventos de cronología pasan de pertenecer a UN
 * mundo (world_id) a poder pertenecer a varios (pivot). En cronología,
 * ningún mundo = evento global de todos los mundos. Las ubicaciones se
 * quedan con un solo mundo: sus coordenadas viven en el mapa de ese mundo.
 */
return new class extends Migration
{
    private const PIVOTS = [
        'story_world' => ['stories', 'story_id'],
        'character_world' => ['characters', 'character_id'],
        'timeline_event_world' => ['timeline_events', 'timeline_event_id'],
    ];

    public function up(): void
    {
        foreach (self::PIVOTS as $pivot => [$tabla, $fk]) {
            if (! Schema::hasTable($pivot)) {
                Schema::create($pivot, function (Blueprint $table) use ($fk) {
                    $table->foreignId($fk)->constrained()->cascadeOnDelete();
                    $table->foreignId('world_id')->constrained()->cascadeOnDelete();
                    $table->primary([$fk, 'world_id']);
                });

                // Migrar la pertenencia actual (world_id) al pivot
                DB::statement("INSERT INTO {$pivot} ({$fk}, world_id) SELECT id, world_id FROM {$tabla} WHERE world_id IS NOT NULL");
            }

            // world_id pasa a ser historial: nullable y sin uso en el codigo
            DB::statement("ALTER TABLE {$tabla} MODIFY world_id BIGINT UNSIGNED NULL");
        }
    }

    public function down(): void
    {
        foreach (array_keys(self::PIVOTS) as $pivot) {
            Schema::dropIfExists($pivot);
        }
    }
};
