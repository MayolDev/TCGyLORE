<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Archetype;
use App\Models\Alignment;
use App\Models\Faction;
use App\Models\Edition;
use App\Models\Artist;
use App\Models\Character;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class CardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_loads_cards()
    {
        // Setup dependencies
        $role = Role::firstOrCreate(['name' => 'Admin']);
        $admin = User::factory()->create();
        $admin->assignRole($role);

        $world = World::create(['name' => 'Test World', 'description' => 'A large description that should not be loaded entirely if optimized.']);
        $cardType = CardType::create(['name' => 'Spell', 'description' => 'Magic stuff']);
        $rarity = Rarity::create(['name' => 'Common', 'description' => 'Everywhere']);
        $archetype = Archetype::create(['name' => 'Warrior', 'description' => 'Fights stuff']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Whatever']);
        $faction = Faction::create(['name' => 'Rebels', 'description' => 'Fight power']);
        $edition = Edition::create(['name' => 'First Edition', 'description' => 'Rare']);
        $artist = Artist::create(['name' => 'Da Vinci', 'bio' => 'Old guy']);
        $character = Character::create(['name' => 'Hero', 'biography' => 'Very long biography...', 'world_id' => $world->id]);

        $card = Card::create([
            'name' => 'Fireball',
            'cost' => 5,
            'effect' => 'Deals damage',
            'world_id' => $world->id,
            'character_id' => $character->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'archetype_id' => $archetype->id,
            'alignment_id' => $alignment->id,
            'faction_id' => $faction->id,
            'edition_id' => $edition->id,
            'artist_id' => $artist->id,
        ]);

        DB::enableQueryLog();

        $response = $this->actingAs($admin)->get('/admin/cards');

        $response->assertOk();

        $log = DB::getQueryLog();

        // Check that we are NOT selecting * from worlds (or characters, etc)
        $hasWildcardWorld = collect($log)->contains(function ($query) {
             return str_contains($query['query'], 'select * from "worlds"');
        });

        $this->assertFalse($hasWildcardWorld, 'Should not select * from worlds');

        // Check that we ARE selecting id, name from worlds (SQLite quotes usually "id", "name" or just id, name depending on driver wrapper, but Laravel usually uses quotes)
        // Adjusting regex to be safer
        $hasOptimizedWorld = collect($log)->contains(function ($query) {
             return str_contains($query['query'], 'from "worlds"') &&
                    (str_contains($query['query'], '"id", "name"') || str_contains($query['query'], '"name", "id"'));
        });

        $this->assertTrue($hasOptimizedWorld, 'Should select specific columns from worlds');
    }
}
