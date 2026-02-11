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
            $table->foreignId('rarity_id')->nullable()->constrained('rarities')->nullOnDelete();
            $table->foreignId('card_type_id')->nullable()->constrained('card_types')->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained('archetypes')->nullOnDelete();
            $table->foreignId('alignment_id')->nullable()->constrained('alignments')->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained('factions')->nullOnDelete();
            $table->foreignId('edition_id')->nullable()->constrained('editions')->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained('artists')->nullOnDelete();
        });

        Schema::table('cards', function (Blueprint $table) {
            $table->dropColumn(['rarity', 'card_type', 'archetype', 'alignment', 'faction', 'edition', 'artist']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->string('rarity')->default('comun');
            $table->string('card_type')->nullable();
            $table->string('archetype')->nullable();
            $table->string('alignment')->default('neutral');
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();
        });

        Schema::table('cards', function (Blueprint $table) {
            $table->dropForeign(['rarity_id']);
            $table->dropColumn('rarity_id');
            $table->dropForeign(['card_type_id']);
            $table->dropColumn('card_type_id');
            $table->dropForeign(['archetype_id']);
            $table->dropColumn('archetype_id');
            $table->dropForeign(['alignment_id']);
            $table->dropColumn('alignment_id');
            $table->dropForeign(['faction_id']);
            $table->dropColumn('faction_id');
            $table->dropForeign(['edition_id']);
            $table->dropColumn('edition_id');
            $table->dropForeign(['artist_id']);
            $table->dropColumn('artist_id');
        });
    }
};
