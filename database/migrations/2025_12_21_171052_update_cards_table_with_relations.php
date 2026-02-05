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
            $table->foreignId('card_type_id')->nullable()->constrained();
            $table->foreignId('rarity_id')->nullable()->constrained();
            $table->foreignId('archetype_id')->nullable()->constrained();
            $table->foreignId('alignment_id')->nullable()->constrained();
            $table->foreignId('faction_id')->nullable()->constrained();
            $table->foreignId('edition_id')->nullable()->constrained();
            $table->foreignId('artist_id')->nullable()->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropColumn([
                'card_type_id',
                'rarity_id',
                'archetype_id',
                'alignment_id',
                'faction_id',
                'edition_id',
                'artist_id'
            ]);
        });
    }
};
