<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Quién hizo cada cambio. user_name pervive aunque el usuario se borre. */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('card_logs', 'user_id')) {
            Schema::table('card_logs', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('card_name')->constrained()->nullOnDelete();
                $table->string('user_name')->nullable()->after('user_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('card_logs', 'user_id')) {
            Schema::table('card_logs', function (Blueprint $table) {
                $table->dropConstrainedForeignId('user_id');
                $table->dropColumn('user_name');
            });
        }
    }
};
