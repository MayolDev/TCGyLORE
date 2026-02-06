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
            // Drop old columns
            $table->dropColumn(['card_type', 'rarity', 'alignment', 'archetype', 'faction', 'edition', 'artist']);

            // Add new foreign keys
            $table->foreignId('card_type_id')->constrained('card_types');
            $table->foreignId('rarity_id')->constrained('rarities');
            $table->foreignId('alignment_id')->constrained('alignments');
            $table->foreignId('archetype_id')->nullable()->constrained('archetypes');
            $table->foreignId('faction_id')->nullable()->constrained('factions');
            $table->foreignId('artist_id')->nullable()->constrained('artists');

            // edition_id cannot be constrained here because editions table is created later
            $table->unsignedBigInteger('edition_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Note: In SQLite, dropForeign is ignored usually, but let's keep it for compatibility
            if (DB::getDriverName() !== 'sqlite') {
                $table->dropForeign(['card_type_id']);
                $table->dropForeign(['rarity_id']);
                $table->dropForeign(['alignment_id']);
                $table->dropForeign(['archetype_id']);
                $table->dropForeign(['faction_id']);
                $table->dropForeign(['artist_id']);
            }

            $table->dropColumn(['card_type_id', 'rarity_id', 'alignment_id', 'archetype_id', 'faction_id', 'artist_id', 'edition_id']);

            $table->string('card_type');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->string('archetype');
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();
        });
    }
};
