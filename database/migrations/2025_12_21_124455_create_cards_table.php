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
            $table->integer('defense')->nullable();
            $table->integer('magic_defense')->nullable();
            $table->integer('cost');
            $table->foreignId('archetype_id')->nullable()->constrained();
            $table->foreignId('card_type_id')->constrained();
            $table->foreignId('alignment_id')->constrained();
            $table->foreignId('rarity_id')->constrained();
            $table->foreignId('faction_id')->nullable()->constrained();
            $table->foreignId('edition_id')->nullable()->constrained();
            $table->foreignId('artist_id')->nullable()->constrained();
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
