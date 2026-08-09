<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('stories', 'cover_image')) {
            Schema::table('stories', function (Blueprint $table) {
                $table->string('cover_image')->nullable()->after('category');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('stories', 'cover_image')) {
            Schema::table('stories', function (Blueprint $table) {
                $table->dropColumn('cover_image');
            });
        }
    }
};
