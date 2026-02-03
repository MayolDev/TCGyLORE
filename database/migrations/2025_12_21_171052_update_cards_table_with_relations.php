<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Add new FK columns
            $table->foreignId('card_type_id')->nullable()->constrained('card_types');
            $table->foreignId('rarity_id')->nullable()->constrained('rarities');
            $table->foreignId('archetype_id')->nullable()->constrained('archetypes');
            $table->foreignId('alignment_id')->nullable()->constrained('alignments');
            $table->foreignId('faction_id')->nullable()->constrained('factions');
            $table->foreignId('edition_id')->nullable()->constrained('editions');
            $table->foreignId('artist_id')->nullable()->constrained('artists');

            // Drop old columns
            $table->dropColumn(['card_type', 'rarity', 'archetype', 'alignment', 'faction', 'edition', 'artist']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Restore old columns
            $table->string('card_type')->nullable();
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->string('archetype')->nullable();
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();

            // Drop FK columns
            if (DB::getDriverName() !== 'sqlite') {
                $table->dropForeign(['card_type_id']);
                $table->dropForeign(['rarity_id']);
                $table->dropForeign(['archetype_id']);
                $table->dropForeign(['alignment_id']);
                $table->dropForeign(['faction_id']);
                $table->dropForeign(['edition_id']);
                $table->dropForeign(['artist_id']);
            }

            $table->dropColumn(['card_type_id', 'rarity_id', 'archetype_id', 'alignment_id', 'faction_id', 'edition_id', 'artist_id']);
        });
    }
};
