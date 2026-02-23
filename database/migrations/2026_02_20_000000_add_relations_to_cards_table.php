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
            $table->foreignId('alignment_id')->nullable()->constrained('alignments')->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained('archetypes')->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained('factions')->nullOnDelete();
            $table->foreignId('edition_id')->nullable()->constrained('editions')->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained('artists')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Drop foreign keys first (SQLite handles this differently, but for standard DBs)
            // In SQLite, dropping column drops constraint usually.

            $table->dropColumn([
                'rarity_id',
                'card_type_id',
                'alignment_id',
                'archetype_id',
                'faction_id',
                'edition_id',
                'artist_id',
            ]);
        });
    }
};
