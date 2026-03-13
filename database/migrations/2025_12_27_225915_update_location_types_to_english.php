<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE locations MODIFY COLUMN location_type VARCHAR(50)");
        }

        DB::table('locations')->where('location_type', 'castillo')->update(['location_type' => 'castle']);
        DB::table('locations')->where('location_type', 'ciudad')->update(['location_type' => 'city']);
        DB::table('locations')->where('location_type', 'pueblo')->update(['location_type' => 'village']);
        DB::table('locations')->where('location_type', 'bosque')->update(['location_type' => 'forest']);
        DB::table('locations')->where('location_type', 'montaña')->update(['location_type' => 'mountain']);
        DB::table('locations')->where('location_type', 'mazmorra')->update(['location_type' => 'dungeon']);
        DB::table('locations')->where('location_type', 'ruinas')->update(['location_type' => 'ruins']);
        DB::table('locations')->where('location_type', 'campo_batalla')->update(['location_type' => 'battlefield']);
        DB::table('locations')->where('location_type', 'puerto')->update(['location_type' => 'port']);
        DB::table('locations')->where('location_type', 'templo')->update(['location_type' => 'temple']);
        DB::table('locations')->where('location_type', 'cueva')->update(['location_type' => 'cave']);
        DB::table('locations')->where('location_type', 'torre')->update(['location_type' => 'tower']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('locations')->where('location_type', 'castle')->update(['location_type' => 'castillo']);
        DB::table('locations')->where('location_type', 'city')->update(['location_type' => 'ciudad']);
        DB::table('locations')->where('location_type', 'village')->update(['location_type' => 'pueblo']);
        DB::table('locations')->where('location_type', 'forest')->update(['location_type' => 'bosque']);
        DB::table('locations')->where('location_type', 'mountain')->update(['location_type' => 'montaña']);
        DB::table('locations')->where('location_type', 'dungeon')->update(['location_type' => 'mazmorra']);
        DB::table('locations')->where('location_type', 'ruins')->update(['location_type' => 'ruins']);
        DB::table('locations')->where('location_type', 'battlefield')->update(['location_type' => 'campo_batalla']);
        DB::table('locations')->where('location_type', 'port')->update(['location_type' => 'puerto']);
        DB::table('locations')->where('location_type', 'temple')->update(['location_type' => 'templo']);
        DB::table('locations')->where('location_type', 'cave')->update(['location_type' => 'cueva']);
        DB::table('locations')->where('location_type', 'tower')->update(['location_type' => 'torre']);

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE locations MODIFY COLUMN location_type ENUM('castillo','ciudad','pueblo','bosque','montaña','mazmorra','ruinas','campo_batalla','puerto','templo','cueva','torre') DEFAULT 'ciudad'");
        }
    }
};
