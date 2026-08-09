<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('worlds', 'map_image')) {
            Schema::table('worlds', function (Blueprint $table) {
                $table->string('map_image')->nullable()->after('banner_image');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('worlds', 'map_image')) {
            Schema::table('worlds', function (Blueprint $table) {
                $table->dropColumn('map_image');
            });
        }
    }
};
