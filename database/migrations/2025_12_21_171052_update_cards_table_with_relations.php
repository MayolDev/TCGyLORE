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
            // Drop legacy columns if they exist (using array for cleaner syntax)
            $table->dropColumn(['archetype', 'card_type', 'alignment', 'rarity', 'faction', 'edition', 'artist']);

            // Add new relation columns
            $table->foreignId('card_type_id')->nullable()->constrained();
            $table->foreignId('rarity_id')->nullable()->constrained();
            $table->foreignId('archetype_id')->nullable()->constrained();
            $table->foreignId('alignment_id')->nullable()->constrained();
            $table->foreignId('faction_id')->nullable()->constrained();
            $table->foreignId('artist_id')->nullable()->constrained();

            // Add edition_id without constraint initially because editions table might be created later
            $table->unsignedBigInteger('edition_id')->nullable();

            // Add stats columns
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
            $table->dropColumn([
                'card_type_id',
                'rarity_id',
                'archetype_id',
                'alignment_id',
                'faction_id',
                'artist_id',
                'edition_id',
                'defense',
                'magic_defense'
            ]);

            // Re-add legacy columns (simplified types for rollback)
            $table->string('archetype')->nullable();
            $table->string('card_type')->nullable();
            $table->string('alignment')->nullable();
            $table->string('rarity')->nullable();
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();
        });
    }
};
