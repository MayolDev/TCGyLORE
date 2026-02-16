<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->integer('defense')->nullable()->after('mind');
            $table->integer('magic_defense')->nullable()->after('defense');

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
            $table->dropColumn(['defense', 'magic_defense']);

            if (DB::getDriverName() !== 'sqlite') {
                $table->dropForeign(['card_type_id']);
                $table->dropForeign(['rarity_id']);
                $table->dropForeign(['archetype_id']);
                $table->dropForeign(['alignment_id']);
                $table->dropForeign(['faction_id']);
                $table->dropForeign(['edition_id']);
                $table->dropForeign(['artist_id']);
            }

            $table->dropColumn(['card_type_id', 'rarity_id', 'archetype_id', 'alignment_id', 'faction_id', 'edition_id', 'artist_id']);
        });
    }
};
