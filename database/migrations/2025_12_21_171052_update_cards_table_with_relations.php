<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Convierte las columnas de texto de `cards` en claves foraneas hacia las tablas
 * de taxonomia, y anade los atributos defensivos.
 *
 * Esta migracion estaba vacia en el repositorio: solo tenia `//`. La base de datos
 * de produccion si tiene estas columnas, asi que su contenido se perdio en algun
 * momento despues de haberla ejecutado. Sin ella una instalacion limpia falla en
 * `add_health_to_cards_table`, que coloca `health` despues de `magic_defense`, y el
 * modelo Card apunta a columnas que no existen.
 *
 * Todo va guardado con hasColumn para que sea seguro ejecutarla sobre la base de
 * datos de produccion, donde las columnas ya estan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            foreach (['archetype', 'card_type', 'alignment', 'rarity', 'faction', 'edition', 'artist'] as $columna) {
                if (Schema::hasColumn('cards', $columna)) {
                    $table->dropColumn($columna);
                }
            }
        });

        Schema::table('cards', function (Blueprint $table) {
            if (! Schema::hasColumn('cards', 'card_type_id')) {
                $table->foreignId('card_type_id')->nullable()->after('character_id')->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('cards', 'rarity_id')) {
                $table->foreignId('rarity_id')->nullable()->after('card_type_id')->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('cards', 'archetype_id')) {
                $table->foreignId('archetype_id')->nullable()->after('rarity_id')->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('cards', 'alignment_id')) {
                $table->foreignId('alignment_id')->nullable()->after('archetype_id')->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('cards', 'faction_id')) {
                $table->foreignId('faction_id')->nullable()->after('alignment_id')->constrained()->nullOnDelete();
            }
            // `editions` se crea en una migracion posterior, asi que aqui solo cabe
            // la columna. La restriccion la pone add_edition_foreign_key_to_cards.
            if (! Schema::hasColumn('cards', 'edition_id')) {
                $table->foreignId('edition_id')->nullable()->after('faction_id');
            }
            if (! Schema::hasColumn('cards', 'artist_id')) {
                $table->foreignId('artist_id')->nullable()->after('edition_id')->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('cards', 'defense')) {
                $table->integer('defense')->nullable()->after('mind');
            }
            if (! Schema::hasColumn('cards', 'magic_defense')) {
                $table->integer('magic_defense')->nullable()->after('defense');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            foreach (['card_type', 'rarity', 'archetype', 'alignment', 'faction', 'edition', 'artist'] as $rel) {
                $columna = $rel.'_id';
                if (Schema::hasColumn('cards', $columna)) {
                    $table->dropConstrainedForeignKey($columna);
                }
            }
            foreach (['defense', 'magic_defense'] as $columna) {
                if (Schema::hasColumn('cards', $columna)) {
                    $table->dropColumn($columna);
                }
            }
        });

        Schema::table('cards', function (Blueprint $table) {
            $table->string('archetype')->nullable();
            $table->string('card_type')->nullable();
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();
        });
    }
};
