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

            // Eliminar columnas antiguas
            $table->dropColumn(['card_type', 'rarity', 'alignment', 'archetype', 'faction', 'artist']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
