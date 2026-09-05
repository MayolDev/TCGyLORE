<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Relaciones entre personajes. Se guarda UNA fila por pareja y se lee desde
 * los dos lados: `type` es como ve A a B ("Maestro de") e `inverse_type` como
 * ve B a A ("Discipulo de"). Asi no hay filas duplicadas que se puedan
 * contradecir, y las relaciones simetricas ("Hermano de") dejan el inverso
 * vacio y reutilizan el mismo texto.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('character_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('character_id')->constrained()->cascadeOnDelete();
            $table->foreignId('related_character_id')->constrained('characters')->cascadeOnDelete();
            $table->string('type', 120);
            $table->string('inverse_type', 120)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['character_id', 'related_character_id']);
            $table->index('related_character_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('character_relations');
    }
};
