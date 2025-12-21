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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('world_id')->constrained()->cascadeOnDelete();
            $table->foreignId('character_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('illustration')->nullable();
            $table->longText('effect');
            $table->integer('strength')->nullable();
            $table->integer('agility')->nullable();
            $table->integer('charisma')->nullable();
            $table->integer('mind')->nullable();
            $table->integer('cost');
            $table->string('archetype');
            $table->string('card_type');
            $table->enum('alignment', ['luz', 'oscuridad', 'neutral'])->default('neutral');
            $table->enum('rarity', ['comun', 'rara', 'epica', 'legendaria'])->default('comun');
            $table->string('faction')->nullable();
            $table->string('edition')->nullable();
            $table->string('artist')->nullable();
            $table->text('flavor_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
