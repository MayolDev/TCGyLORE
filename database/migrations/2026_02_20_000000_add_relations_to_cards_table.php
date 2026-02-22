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
            // Add foreign key for rarity relationship if it doesn't exist
            // This is required for the dashboard performance optimization
            if (!Schema::hasColumn('cards', 'rarity_id')) {
                $table->foreignId('rarity_id')->nullable()->constrained('rarities')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            if (Schema::hasColumn('cards', 'rarity_id')) {
                $table->dropColumn('rarity_id');
            }
        });
    }
};
