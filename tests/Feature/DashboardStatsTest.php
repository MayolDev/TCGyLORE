<?php

use App\Models\Card;
use App\Models\Character;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    $this->withoutVite();

    if (!Schema::hasColumn('cards', 'rarity_id')) {
        Schema::table('cards', function($table) {
            $table->integer('rarity_id')->nullable();
        });
    }
});

test('dashboard stats calculates cards by rarity correctly', function () {
    $user = User::factory()->create();
    $world = World::forceCreate(['name' => 'Test World', 'description' => 'Desc']);
    $character = Character::forceCreate(['name' => 'Test Character', 'world_id' => $world->id, 'biography' => 'Bio']);

    $commonRarity = Rarity::create(['name' => 'Común']);
    $rareRarity = Rarity::create(['name' => 'Rara']);

    Card::forceCreate([
        'name' => 'Card 1', 'rarity_id' => $commonRarity->id, 'world_id' => $world->id, 'character_id' => $character->id,
        'card_type' => 'personaje', 'rarity' => 'comun', 'archetype' => 'tanque',
        'effect' => 'Effect', 'strength' => 1, 'agility' => 1, 'charisma' => 1, 'mind' => 1, 'health' => 1, 'cost' => 1
    ]);
    Card::forceCreate([
        'name' => 'Card 2', 'rarity_id' => $commonRarity->id, 'world_id' => $world->id, 'character_id' => $character->id,
        'card_type' => 'personaje', 'rarity' => 'comun', 'archetype' => 'tanque',
        'effect' => 'Effect', 'strength' => 1, 'agility' => 1, 'charisma' => 1, 'mind' => 1, 'health' => 1, 'cost' => 1
    ]);
    Card::forceCreate([
        'name' => 'Card 3', 'rarity_id' => $rareRarity->id, 'world_id' => $world->id, 'character_id' => $character->id,
        'card_type' => 'personaje', 'rarity' => 'rara', 'archetype' => 'tanque',
        'effect' => 'Effect', 'strength' => 1, 'agility' => 1, 'charisma' => 1, 'mind' => 1, 'health' => 1, 'cost' => 1
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));
    $response->assertOk();

    $stats = $response->viewData('page')['props']['stats'];
    $this->assertEquals(2, $stats['cards_by_rarity']['Común']);
    $this->assertEquals(1, $stats['cards_by_rarity']['Rara']);
});
