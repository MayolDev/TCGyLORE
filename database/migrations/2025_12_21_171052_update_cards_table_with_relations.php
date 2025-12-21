<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Eliminar columnas antiguas de string
            $table->dropColumn([
                'card_type',
                'archetype',
                'alignment',
                'rarity',
                'faction',
                'artist',
            ]);
        });

        Schema::table('cards', function (Blueprint $table) {
            // Agregar foreign keys
            $table->foreignId('card_type_id')->after('world_id')->constrained()->cascadeOnDelete();
            $table->foreignId('rarity_id')->after('cost')->constrained()->cascadeOnDelete();
            $table->foreignId('alignment_id')->nullable()->after('rarity_id')->constrained()->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->after('alignment_id')->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->after('flavor_text')->constrained()->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->after('artist_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Eliminar foreign keys
            $table->dropForeign(['card_type_id']);
            $table->dropForeign(['rarity_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['artist_id']);
            $table->dropForeign(['archetype_id']);
            
            $table->dropColumn([
                'card_type_id',
                'rarity_id',
                'alignment_id',
                'faction_id',
                'artist_id',
                'archetype_id',
            ]);
        });

        Schema::table('cards', function (Blueprint $table) {
            // Restaurar columnas antiguas
            $table->string('card_type');
            $table->string('archetype');
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->string('faction')->nullable();
            $table->string('artist')->nullable();
        });
    }
};
