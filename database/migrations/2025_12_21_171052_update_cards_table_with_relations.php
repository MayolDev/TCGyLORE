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
            // Drop old string columns if they exist
            // Using separate calls or array depending on driver, but Laravel handles array usually.
            // However, to be safe with SQLite constraints/copying:

            $table->dropColumn(['card_type', 'rarity', 'archetype', 'alignment', 'faction', 'artist', 'edition']);

            // Add new foreign keys
            $table->foreignId('card_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('rarity_id')->constrained()->cascadeOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('alignment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained()->nullOnDelete();

            // Edition table doesn't exist yet at this point in migration order (created 2025_12_27),
            // so we add the column but can't constrain it yet.
            $table->unsignedBigInteger('edition_id')->nullable();

            // Stats
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
            $table->string('card_type');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->string('archetype');
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->string('faction')->nullable();
            $table->string('artist')->nullable();
            $table->string('edition')->nullable();

            $table->dropForeign(['card_type_id']);
            $table->dropForeign(['rarity_id']);
            $table->dropForeign(['archetype_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['artist_id']);

            $table->dropColumn(['card_type_id', 'rarity_id', 'archetype_id', 'alignment_id', 'faction_id', 'artist_id', 'edition_id', 'defense', 'magic_defense']);
        });
    }
};
