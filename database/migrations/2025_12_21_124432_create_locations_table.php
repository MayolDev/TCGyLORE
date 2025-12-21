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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('world_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description');
            $table->enum('location_type', ['ciudad', 'bosque', 'mazmorra', 'reino', 'montaña', 'mar', 'templo', 'ruina'])->default('ciudad');
            $table->decimal('coordinate_x', 8, 2)->nullable();
            $table->decimal('coordinate_y', 8, 2)->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_discovered')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
