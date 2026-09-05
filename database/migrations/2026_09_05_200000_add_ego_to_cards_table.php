<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * EGO de la criatura (Reglamento 0.4, §8). Es orgullo, no poder: va de 0 a 6
 * y la suma de EGO en juego no puede pasar de CAR + 3.
 *
 * El Taller ya lo pedia y lo guardaba dentro de taller_data, pero al no
 * existir como columna la web no podia ni ensenarlo ni filtrar por el.
 * Nullable a proposito: solo las criaturas tienen EGO.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->unsignedTinyInteger('ego')->nullable()->after('charisma');
        });
    }

    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropColumn('ego');
        });
    }
};
