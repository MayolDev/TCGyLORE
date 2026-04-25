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
            if (!Schema::hasColumn('cards', 'card_type_id')) { $table->foreignId('card_type_id')->nullable()->constrained()->nullOnDelete(); }
            if (!Schema::hasColumn('cards', 'rarity_id')) { $table->foreignId('rarity_id')->nullable()->constrained()->nullOnDelete(); }
            if (!Schema::hasColumn('cards', 'archetype_id')) { $table->foreignId('archetype_id')->nullable()->constrained()->nullOnDelete(); }
            if (!Schema::hasColumn('cards', 'alignment_id')) { $table->foreignId('alignment_id')->nullable()->constrained()->nullOnDelete(); }
            if (!Schema::hasColumn('cards', 'faction_id')) { $table->foreignId('faction_id')->nullable()->constrained()->nullOnDelete(); }
            if (!Schema::hasColumn('cards', 'edition_id')) { $table->foreignId('edition_id')->nullable()->constrained()->nullOnDelete(); }
            if (!Schema::hasColumn('cards', 'artist_id')) { $table->foreignId('artist_id')->nullable()->constrained()->nullOnDelete(); }
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
