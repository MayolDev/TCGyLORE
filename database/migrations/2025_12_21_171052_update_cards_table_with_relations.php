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
            $table->foreignId('card_type_id')->nullable()->constrained('card_types')->nullOnDelete();
            $table->foreignId('rarity_id')->nullable()->constrained('rarities')->nullOnDelete();
            $table->foreignId('alignment_id')->nullable()->constrained('alignments')->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained('factions')->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained('artists')->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained('archetypes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropForeign(['card_type_id']);
            $table->dropForeign(['rarity_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['artist_id']);
            $table->dropForeign(['archetype_id']);

            $table->dropColumn([
                'card_type_id',
                'rarity_id',
                'alignment_id',
                'faction_id',
                'artist_id',
                'archetype_id',
            ]);
        });
    }
};
