<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Cierra la clave foranea de `cards.edition_id`.
 *
 * La columna se crea en update_cards_table_with_relations, pero la tabla `editions`
 * no existe hasta create_editions_table, que va despues. Esta migracion pone la
 * restriccion una vez ambas estan en su sitio.
 *
 * En produccion la restriccion ya existe, asi que hay que comprobarlo antes de
 * crearla: si no, el deploy muere aqui con "Duplicate foreign key constraint" y,
 * como deploy.sh corre con `set -e` despues de `artisan down`, el sitio se queda
 * en modo mantenimiento.
 */
return new class extends Migration
{
    private function yaTieneRestriccion(): bool
    {
        return DB::selectOne("
            SELECT 1 FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'cards'
              AND COLUMN_NAME = 'edition_id'
              AND REFERENCED_TABLE_NAME IS NOT NULL
            LIMIT 1
        ") !== null;
    }

    public function up(): void
    {
        if (! Schema::hasTable('editions') || ! Schema::hasColumn('cards', 'edition_id')) {
            return;
        }
        if ($this->yaTieneRestriccion()) {
            return;
        }

        Schema::table('cards', function (Blueprint $table) {
            $table->foreign('edition_id')->references('id')->on('editions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('cards', 'edition_id') || ! $this->yaTieneRestriccion()) {
            return;
        }

        Schema::table('cards', function (Blueprint $table) {
            $table->dropForeign(['edition_id']);
        });
    }
};
