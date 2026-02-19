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
            $table->foreignId('card_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('rarity_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('alignment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('edition_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained()->nullOnDelete();

            $table->integer('defense')->nullable();
            $table->integer('magic_defense')->nullable();
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
            $table->dropForeign(['archetype_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['edition_id']);
            $table->dropForeign(['artist_id']);

            $table->dropColumn([
                'card_type_id',
                'rarity_id',
                'archetype_id',
                'alignment_id',
                'faction_id',
                'edition_id',
                'artist_id',
                'defense',
                'magic_defense'
            ]);
        });
    }
};
