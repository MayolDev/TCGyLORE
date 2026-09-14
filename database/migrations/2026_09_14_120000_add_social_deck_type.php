<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * El mazo social: la Baraja de Pactos de Protagonistas-2. Son cartas que se
 * construyen en el mazo como cualquier otra (Reglamento §13), asi que hacen
 * falta dos cosas: un tipo de mazo propio y una zona donde meterlas.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Los enum de MySQL se cambian con SQL crudo: Doctrine no los toca.
        DB::statement("ALTER TABLE decks MODIFY COLUMN type ENUM('normal','eventos','social') NOT NULL DEFAULT 'normal'");
        DB::statement("ALTER TABLE deck_cards MODIFY COLUMN zone ENUM('protagonista','senda','principal','side','eventos','pacto') NOT NULL DEFAULT 'principal'");

        foreach (['Pacto', 'Trampa', 'Muro'] as $tipo) {
            if (! DB::table('card_types')->where('name', $tipo)->exists()) {
                DB::table('card_types')->insert([
                    'name' => $tipo,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Antes de estrechar el enum hay que vaciar lo que ya no cabria, o
        // MySQL deja esas filas en cadena vacia sin avisar.
        DB::table('deck_cards')->where('zone', 'pacto')->delete();
        DB::table('decks')->where('type', 'social')->delete();

        DB::statement("ALTER TABLE decks MODIFY COLUMN type ENUM('normal','eventos') NOT NULL DEFAULT 'normal'");
        DB::statement("ALTER TABLE deck_cards MODIFY COLUMN zone ENUM('protagonista','senda','principal','side','eventos') NOT NULL DEFAULT 'principal'");
    }
};
