<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Añadir campos de defensa
            $table->integer('defense')->nullable()->after('mind');
            $table->integer('magic_defense')->nullable()->after('defense');

            // Cambiar campos de texto a foreign keys
            $table->foreignId('card_type_id')->nullable()->after('cost')->constrained()->nullOnDelete();
            $table->foreignId('rarity_id')->nullable()->after('card_type_id')->constrained()->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->after('rarity_id')->constrained()->nullOnDelete();
            $table->foreignId('alignment_id')->nullable()->after('archetype_id')->constrained()->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->after('alignment_id')->constrained()->nullOnDelete();
            $table->foreignId('edition_id')->nullable()->after('faction_id')->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->after('edition_id')->constrained()->nullOnDelete();

            // Eliminar los campos antiguos de texto
            $table->dropColumn(['card_type', 'rarity', 'archetype', 'alignment', 'faction', 'edition', 'artist']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Restaurar campos de texto
            $table->string('card_type')->after('cost');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun')->after('card_type');
            $table->string('archetype')->after('rarity');
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral')->after('archetype');
            $table->string('faction')->nullable()->after('alignment');
            $table->string('edition')->nullable()->after('faction');
            $table->string('artist')->nullable()->after('edition');

            // Eliminar foreign keys y campos de defensa
            $table->dropForeign(['card_type_id']);
            $table->dropForeign(['rarity_id']);
            $table->dropForeign(['archetype_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['edition_id']);
            $table->dropForeign(['artist_id']);

            $table->dropColumn(['card_type_id', 'rarity_id', 'archetype_id', 'alignment_id', 'faction_id', 'edition_id', 'artist_id', 'defense', 'magic_defense']);
        });
    }
};
