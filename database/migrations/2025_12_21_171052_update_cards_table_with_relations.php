<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            // Add new foreign keys
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

            if (! Schema::hasColumn('cards', 'defense')) {
                $table->integer('defense')->nullable();
            }
            if (! Schema::hasColumn('cards', 'magic_defense')) {
                $table->integer('magic_defense')->nullable();
            }
        });

        // Migrate data (best effort)
        if (Schema::hasColumn('cards', 'rarity')) {
            DB::statement('UPDATE cards SET rarity_id = (SELECT id FROM rarities WHERE LOWER(name) = LOWER(cards.rarity))');
        }
        if (Schema::hasColumn('cards', 'card_type')) {
            DB::statement('UPDATE cards SET card_type_id = (SELECT id FROM card_types WHERE LOWER(name) = LOWER(cards.card_type))');
        }
        if (Schema::hasColumn('cards', 'archetype')) {
            DB::statement('UPDATE cards SET archetype_id = (SELECT id FROM archetypes WHERE LOWER(name) = LOWER(cards.archetype))');
        }
        if (Schema::hasColumn('cards', 'alignment')) {
            DB::statement('UPDATE cards SET alignment_id = (SELECT id FROM alignments WHERE LOWER(name) = LOWER(cards.alignment))');
        }
        if (Schema::hasColumn('cards', 'faction')) {
            DB::statement('UPDATE cards SET faction_id = (SELECT id FROM factions WHERE LOWER(name) = LOWER(cards.faction))');
        }
        if (Schema::hasColumn('cards', 'artist')) {
            DB::statement('UPDATE cards SET artist_id = (SELECT id FROM artists WHERE LOWER(name) = LOWER(cards.artist))');
        }

        Schema::table('cards', function (Blueprint $table) {
            // Drop old columns
            if (Schema::hasColumn('cards', 'card_type')) {
                $table->dropColumn('card_type');
            }
            if (Schema::hasColumn('cards', 'rarity')) {
                $table->dropColumn('rarity');
            }
            if (Schema::hasColumn('cards', 'archetype')) {
                $table->dropColumn('archetype');
            }
            if (Schema::hasColumn('cards', 'alignment')) {
                $table->dropColumn('alignment');
            }
            if (Schema::hasColumn('cards', 'faction')) {
                $table->dropColumn('faction');
            }
            if (Schema::hasColumn('cards', 'artist')) {
                $table->dropColumn('artist');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            if (! Schema::hasColumn('cards', 'archetype')) {
                $table->string('archetype')->nullable();
            }
            if (! Schema::hasColumn('cards', 'card_type')) {
                $table->string('card_type')->nullable();
            }
            if (! Schema::hasColumn('cards', 'alignment')) {
                $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            }
            if (! Schema::hasColumn('cards', 'rarity')) {
                $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            }
            if (! Schema::hasColumn('cards', 'faction')) {
                $table->string('faction')->nullable();
            }
            if (! Schema::hasColumn('cards', 'artist')) {
                $table->string('artist')->nullable();
            }

            // We cannot easily restore data without a temporary column or complex logic,
            // but usually down migrations are destructive for data migrated UP.
            // Ideally we would reverse the UPDATE logic here too.
        });

        Schema::table('cards', function (Blueprint $table) {
            if (Schema::hasColumn('cards', 'card_type_id')) {
                $table->dropConstrainedForeignId('card_type_id');
            }
            if (Schema::hasColumn('cards', 'rarity_id')) {
                $table->dropConstrainedForeignId('rarity_id');
            }
            if (Schema::hasColumn('cards', 'archetype_id')) {
                $table->dropConstrainedForeignId('archetype_id');
            }
            if (Schema::hasColumn('cards', 'alignment_id')) {
                $table->dropConstrainedForeignId('alignment_id');
            }
            if (Schema::hasColumn('cards', 'faction_id')) {
                $table->dropConstrainedForeignId('faction_id');
            }
            if (Schema::hasColumn('cards', 'artist_id')) {
                $table->dropConstrainedForeignId('artist_id');
            }

            if (Schema::hasColumn('cards', 'defense')) {
                $table->dropColumn('defense');
            }
            if (Schema::hasColumn('cards', 'magic_defense')) {
                $table->dropColumn('magic_defense');
            }
        });
    }
};
