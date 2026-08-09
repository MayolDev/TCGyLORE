<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Historial de cambios por carta: cada creación, actualización (con el
 * diff campo a campo) y borrado deja rastro. card_id se anula al borrar
 * la carta para que el registro sobreviva; card_name queda para leerlo.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('card_logs')) {
            Schema::create('card_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('card_id')->nullable()->constrained()->nullOnDelete();
                $table->string('card_name');
                $table->string('action');           // creada · actualizada · eliminada
                $table->string('source')->default('web');  // taller · web
                $table->json('changes')->nullable();       // {campo: {de, a}}
                $table->timestamp('created_at');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('card_logs');
    }
};
