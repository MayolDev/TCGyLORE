<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard stats are calculated correctly', function () {
    $user = User::factory()->create();

    // Create World
    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    // Create Rarities
    $common = Rarity::create(['name' => 'Común']);
    $rare = Rarity::create(['name' => 'Rara']);

    // Create Cards
    // 3 Common cards
    for ($i = 0; $i < 3; $i++) {
        Card::forceCreate([
            'world_id' => $world->id,
            'name' => "Common Card $i",
            'effect' => 'Effect',
            'cost' => 1,
            'archetype' => 'Warrior',
            'card_type' => 'Unit',
            'rarity' => 'comun', // legacy column
            'rarity_id' => $common->id,
            'created_at' => now()->subDays(2),
        ]);
    }

    // 2 Rare cards
    for ($i = 0; $i < 2; $i++) {
        Card::forceCreate([
            'world_id' => $world->id,
            'name' => "Rare Card $i",
            'effect' => 'Effect',
            'cost' => 2,
            'archetype' => 'Mage',
            'card_type' => 'Spell',
            'rarity' => 'rara', // legacy column
            'rarity_id' => $rare->id,
            'created_at' => now()->subDay(),
        ]);
    }

    // A recent card (to test recent_cards)
    $recentCard = Card::forceCreate([
        'world_id' => $world->id,
        'name' => "New Legendary Card",
        'effect' => 'Effect',
        'cost' => 5,
        'archetype' => 'Dragon',
        'card_type' => 'Unit',
        'rarity' => 'legendaria', // legacy column
        // We'll leave rarity_id as common just for simplicity or create another rarity?
        // Let's create a Legendary rarity
        'rarity_id' => Rarity::create(['name' => 'Legendaria'])->id,
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();

    // Check stats structure
    $stats = $response->inertiaProps('stats');

    expect($stats['cards_by_rarity'])->toBeArray()
        ->and($stats['cards_by_rarity']['Común'])->toBe(3)
        ->and($stats['cards_by_rarity']['Rara'])->toBe(2)
        ->and($stats['cards_by_rarity']['Legendaria'])->toBe(1);

    // Check recent cards
    expect($stats['recent_cards'])->toBeArray()
        ->and($stats['recent_cards'][0]['id'])->toBe($recentCard->id)
        ->and($stats['recent_cards'][0]['name'])->toBe('New Legendary Card');
});
