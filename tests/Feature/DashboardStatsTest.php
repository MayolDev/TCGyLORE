<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Inertia\Testing\AssertableInertia;

test('dashboard stats loads correctly', function () {
    // Authenticate
    $this->actingAs($user = User::factory()->create());

    // Create World
    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    // Create Rarities
    $common = Rarity::create(['name' => 'Común', 'description' => 'Common']);
    $rare = Rarity::create(['name' => 'Rara', 'description' => 'Rare']);

    // Create Cards
    // We must unguard because 'archetype' and 'card_type' are non-nullable legacy columns not in fillable
    Card::unguard();

    // 2 Common Cards
    Card::create([
        'world_id' => $world->id,
        'name' => 'Common Card 1',
        'effect' => 'Effect 1',
        'cost' => 1,
        'archetype' => 'Warrior',
        'card_type' => 'Unit',
        'rarity_id' => $common->id,
        'rarity' => 'comun', // Enum column
    ]);

    Card::create([
        'world_id' => $world->id,
        'name' => 'Common Card 2',
        'effect' => 'Effect 2',
        'cost' => 2,
        'archetype' => 'Mage',
        'card_type' => 'Spell',
        'rarity_id' => $common->id,
        'rarity' => 'comun',
    ]);

    // 1 Rare Card
    $rareCard = Card::create([
        'world_id' => $world->id,
        'name' => 'Rare Card 1',
        'effect' => 'Effect 3',
        'cost' => 5,
        'archetype' => 'Dragon',
        'card_type' => 'Unit',
        'rarity_id' => $rare->id,
        'rarity' => 'rara',
    ]);

    // Ensure accurate ordering for latest()
    $rareCard->created_at = now()->addMinute();
    $rareCard->save();

    Card::reguard();

    // Act
    $response = $this->get(route('dashboard'));

    // Assert
    $response->assertOk();

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('dashboard')
        ->has('stats.cards_by_rarity', 2) // 2 keys (Común, Rara)
        ->where('stats.cards_by_rarity.Común', 2)
        ->where('stats.cards_by_rarity.Rara', 1)
        ->has('stats.recent_cards', 3)
        ->where('stats.recent_cards.0.name', 'Rare Card 1') // Latest first
        ->where('stats.recent_cards.0.rarity.name', 'Rara')
        ->where('stats.recent_cards.0.world.name', 'Test World')
    );
});
