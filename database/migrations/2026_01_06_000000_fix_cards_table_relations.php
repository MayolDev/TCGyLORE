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
            // Drop old columns if they exist (using a check might be safer but Schema::hasColumn is per column)
            // Assuming they exist based on create_cards_table
            if (Schema::hasColumn('cards', 'rarity')) {
                $table->dropColumn(['rarity']);
            }
            if (Schema::hasColumn('cards', 'card_type')) {
                $table->dropColumn(['card_type']);
            }
            if (Schema::hasColumn('cards', 'archetype')) {
                $table->dropColumn(['archetype']);
            }
            if (Schema::hasColumn('cards', 'alignment')) {
                $table->dropColumn(['alignment']);
            }
            if (Schema::hasColumn('cards', 'faction')) {
                $table->dropColumn(['faction']);
            }
            if (Schema::hasColumn('cards', 'edition')) {
                $table->dropColumn(['edition']);
            }
            if (Schema::hasColumn('cards', 'artist')) {
                $table->dropColumn(['artist']);
            }

            // Add new foreign key columns
            $table->foreignId('rarity_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('card_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('archetype_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('alignment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('faction_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('edition_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('artist_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropForeign(['rarity_id']);
            $table->dropForeign(['card_type_id']);
            $table->dropForeign(['archetype_id']);
            $table->dropForeign(['alignment_id']);
            $table->dropForeign(['faction_id']);
            $table->dropForeign(['edition_id']);
            $table->dropForeign(['artist_id']);

            $table->dropColumn(['rarity_id', 'card_type_id', 'archetype_id', 'alignment_id', 'faction_id', 'edition_id', 'artist_id']);

            // Re-add old columns (nullable to simplify rollback)
            $table->string('rarity')->nullable();
            $table->string('card_type')->nullable();
            $table->string('archetype')->nullable();
            $table->string('alignment')->nullable();
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();
        });
    }
};
