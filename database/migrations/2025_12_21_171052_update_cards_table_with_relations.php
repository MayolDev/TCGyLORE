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
            // Drop old string/enum columns
            $table->dropColumn([
                'card_type',
                'rarity',
                'archetype',
                'alignment',
                'faction',
                'artist',
                'edition',
            ]);

            // Add foreign keys
            $table->foreignId('card_type_id')->constrained();
            $table->foreignId('rarity_id')->constrained();
            $table->foreignId('archetype_id')->nullable()->constrained();
            $table->foreignId('alignment_id')->constrained();
            $table->foreignId('faction_id')->nullable()->constrained();
            $table->foreignId('artist_id')->nullable()->constrained();

            // Add edition_id (table created later, so no constraint yet)
            $table->foreignId('edition_id')->nullable();

            // Add missing stats
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
                'magic_defense',
            ]);

            $table->string('card_type');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->string('archetype');
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->string('faction')->nullable();
            $table->string('artist')->nullable();
            $table->string('edition')->nullable();
        });
    }
};
