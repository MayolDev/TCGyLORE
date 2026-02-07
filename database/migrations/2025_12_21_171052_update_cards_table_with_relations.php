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
            // Add foreign key columns
            $table->foreignId('rarity_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('card_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('alignment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('edition_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained()->nullOnDelete();

            // Drop legacy string columns
            $table->dropColumn([
                'rarity',
                'card_type',
                'archetype',
                'alignment',
                'faction',
                'edition',
                'artist'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Restore legacy string columns (simplified as strings/text)
            $table->string('rarity')->default('comun');
            $table->string('card_type')->nullable();
            $table->string('archetype')->nullable();
            $table->string('alignment')->default('neutral');
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();

            // Drop foreign key columns
            $table->dropForeign(['rarity_id']);
            $table->dropForeign(['card_type_id']);
            $table->dropForeign(['archetype_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['edition_id']);
            $table->dropForeign(['artist_id']);

            $table->dropColumn([
                'rarity_id',
                'card_type_id',
                'archetype_id',
                'alignment_id',
                'faction_id',
                'edition_id',
                'artist_id'
            ]);
        });
    }
};
