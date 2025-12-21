<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar el seeder de roles primero
        $this->call(RoleSeeder::class);

        // Crear usuario de prueba y asignarle el rol de Admin
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $user->assignRole('Admin');

        // Crear usuario regular de prueba
        $regularUser = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $regularUser->assignRole('Usuario');

        // Ejecutar seeders del sistema de Lore
        $this->call([
            WorldSeeder::class,
            StorySeeder::class,
            CharacterSeeder::class,
            LocationSeeder::class,
            TimelineEventSeeder::class,

            // Card catalog seeders (deben ir antes de CardSeeder)
            CardTypeSeeder::class,
            RaritySeeder::class,
            AlignmentSeeder::class,
            FactionSeeder::class,
            ArtistSeeder::class,
            ArchetypeSeeder::class,

            CardSeeder::class,
            CharacterRelationshipsSeeder::class, // Poblar relaciones many-to-many
        ]);
    }
}
