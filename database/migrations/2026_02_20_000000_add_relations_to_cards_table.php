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
            // Add relation columns if they don't exist
            if (! Schema::hasColumn('cards', 'card_type_id')) {
                $table->foreignId('card_type_id')->nullable()->constrained();
            }
            if (! Schema::hasColumn('cards', 'rarity_id')) {
                $table->foreignId('rarity_id')->nullable()->constrained();
            }
            if (! Schema::hasColumn('cards', 'archetype_id')) {
                $table->foreignId('archetype_id')->nullable()->constrained();
            }
            if (! Schema::hasColumn('cards', 'alignment_id')) {
                $table->foreignId('alignment_id')->nullable()->constrained();
            }
            if (! Schema::hasColumn('cards', 'faction_id')) {
                $table->foreignId('faction_id')->nullable()->constrained();
            }
            if (! Schema::hasColumn('cards', 'artist_id')) {
                $table->foreignId('artist_id')->nullable()->constrained();
            }
            if (! Schema::hasColumn('cards', 'edition_id')) {
                // editions table exists by now (2025_12_27)
                // However, check if editions table actually exists to be safe
                if (Schema::hasTable('editions')) {
                    $table->foreignId('edition_id')->nullable()->constrained();
                } else {
                    $table->foreignId('edition_id')->nullable();
                }
            }

            // Add stats columns if they don't exist
            if (! Schema::hasColumn('cards', 'defense')) {
                $table->integer('defense')->nullable();
            }
            if (! Schema::hasColumn('cards', 'magic_defense')) {
                $table->integer('magic_defense')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $columns = [
                'card_type_id', 'rarity_id', 'archetype_id', 'alignment_id',
                'faction_id', 'artist_id', 'edition_id',
                'defense', 'magic_defense',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('cards', $column)) {
                    // SQLite doesn't support dropping foreign keys easily, so just drop column
                    // But standard dropColumn handles it if supported
                    try {
                        $table->dropColumn($column);
                    } catch (\Exception $e) {
                        // Ignore if fails (e.g. SQLite limitations)
                    }
                }
            }
        });
    }
};
