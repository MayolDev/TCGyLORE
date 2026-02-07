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
            $table->foreignId('alignment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained()->nullOnDelete();

            // edition_id added as nullable without foreign key constraint due to table creation order
            $table->unsignedBigInteger('edition_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // En SQLite dropForeign no siempre funciona igual si no se nombra explicitamente, pero intentamos lo estandar.
            // Si falla en tests, puede requerir manejo especial para SQLite.
            if (DB::getDriverName() !== 'sqlite') {
                $table->dropForeign(['card_type_id']);
                $table->dropForeign(['rarity_id']);
                $table->dropForeign(['alignment_id']);
                $table->dropForeign(['archetype_id']);
                $table->dropForeign(['faction_id']);
                $table->dropForeign(['artist_id']);
            }

            $table->dropColumn([
                'card_type_id',
                'rarity_id',
                'alignment_id',
                'archetype_id',
                'faction_id',
                'artist_id',
                'edition_id'
            ]);
        });
    }
};
