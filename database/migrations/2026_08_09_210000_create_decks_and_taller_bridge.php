<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Mazos de TAPONAZO y puente Taller -> Biblioteca.
 *
 * Un mazo normal consta de: 1 Protagonista, Sendas, cartas principales y
 * sidecards opcionales. Un mazo de eventos lleva solo cartas de tipo Evento.
 * Puede haber varias copias de la misma carta (quantity).
 *
 * cards.taller_data guarda el JSON original de la carta del taller para no
 * perder fidelidad (EGO y demás campos que la BD aún no modela).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('decks')) {
            Schema::create('decks', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->enum('type', ['normal', 'eventos'])->default('normal');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('deck_cards')) {
            Schema::create('deck_cards', function (Blueprint $table) {
                $table->id();
                $table->foreignId('deck_id')->constrained()->cascadeOnDelete();
                $table->foreignId('card_id')->constrained()->cascadeOnDelete();
                $table->enum('zone', ['protagonista', 'senda', 'principal', 'side', 'eventos'])->default('principal');
                $table->unsignedSmallInteger('quantity')->default(1);
                $table->unique(['deck_id', 'card_id', 'zone']);
            });
        }

        if (! Schema::hasColumn('cards', 'taller_data')) {
            Schema::table('cards', function (Blueprint $table) {
                $table->json('taller_data')->nullable()->after('flavor_text');
            });
        }

        // Tipos de carta propios de TAPONAZO que la taxonomía aún no tenía
        foreach (['Protagonista', 'Evento', 'Senda'] as $tipo) {
            if (! DB::table('card_types')->where('name', $tipo)->exists()) {
                DB::table('card_types')->insert([
                    'name' => $tipo,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('deck_cards');
        Schema::dropIfExists('decks');
        if (Schema::hasColumn('cards', 'taller_data')) {
            Schema::table('cards', function (Blueprint $table) {
                $table->dropColumn('taller_data');
            });
        }
    }
};
