<?php

use App\Models\User;
use App\Models\Card;
use App\Models\Rarity;
use App\Models\World;

test('dashboard displays stats correctly', function () {
    $this->withoutVite();

    $user = User::factory()->create();
    $this->actingAs($user);

    // Create some rarities
    $rarityCommon = Rarity::forceCreate(['name' => 'Common']);
    $rarityRare = Rarity::forceCreate(['name' => 'Rare']);

    $world = World::create(['name' => 'Test World', 'description' => 'Test']);

    // Create cards with explicit required columns to satisfy constraints
    Card::forceCreate([
        'name' => 'Card 1', 'world_id' => $world->id, 'rarity_id' => $rarityCommon->id,
        'card_type' => 'test', 'rarity' => 'comun', 'archetype' => 'test', 'effect' => 'test', 'cost' => 1,
    ]);
    Card::forceCreate([
        'name' => 'Card 2', 'world_id' => $world->id, 'rarity_id' => $rarityCommon->id,
        'card_type' => 'test', 'rarity' => 'comun', 'archetype' => 'test', 'effect' => 'test', 'cost' => 1,
    ]);
    Card::forceCreate([
        'name' => 'Card 3', 'world_id' => $world->id, 'rarity_id' => $rarityRare->id,
        'card_type' => 'test', 'rarity' => 'rara', 'archetype' => 'test', 'effect' => 'test', 'cost' => 1,
    ]);
    Card::forceCreate([
        'name' => 'Card 4', 'world_id' => $world->id, 'rarity_id' => null,
        'card_type' => 'test', 'rarity' => 'comun', 'archetype' => 'test', 'effect' => 'test', 'cost' => 1,
    ]);

    $response = $this->get(route('dashboard'));
    $response->assertOk();

    // Ensure the structure exists in Inertia props
    $response->assertInertia(function (\Inertia\Testing\AssertableInertia $page) {
        $page->component('dashboard')
            ->has('stats.cards_by_rarity')
            ->where('stats.cards_by_rarity.Common', 2)
            ->where('stats.cards_by_rarity.Rare', 1);
    });
});
