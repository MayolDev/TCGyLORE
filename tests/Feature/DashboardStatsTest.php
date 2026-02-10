<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('dashboard displays correct card stats by rarity', function () {
    $user = User::factory()->create();
    $world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'Test Description']);

    $common = Rarity::create(['name' => 'Común', 'description' => 'Common']);
    $rare = Rarity::create(['name' => 'Rara', 'description' => 'Rare']);

    // Create cards with minimal required fields
    Card::create([
        'name' => 'Card 1',
        'world_id' => $world->id,
        'rarity_id' => $common->id,
        'cost' => 1,
        'effect' => 'Effect 1',
    ]);
    Card::create([
        'name' => 'Card 2',
        'world_id' => $world->id,
        'rarity_id' => $common->id,
        'cost' => 2,
        'effect' => 'Effect 2',
    ]);
    Card::create([
        'name' => 'Card 3',
        'world_id' => $world->id,
        'rarity_id' => $rare->id,
        'cost' => 3,
        'effect' => 'Effect 3',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity')
            ->where('stats.cards_by_rarity.Común', 2)
            ->where('stats.cards_by_rarity.Rara', 1)
        );
});

test('dashboard displays recent cards with correct fields', function () {
    $user = User::factory()->create();
    $world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'Test Description']);
    $rare = Rarity::create(['name' => 'Rara', 'description' => 'Rare']);

    $card = Card::create([
        'name' => 'Recent Card',
        'world_id' => $world->id,
        'rarity_id' => $rare->id,
        'cost' => 5,
        'effect' => 'Effect',
    ]);

    // Manually update created_at to ensure order if needed, but here checking content

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.recent_cards', 1)
            ->where('stats.recent_cards.0.name', 'Recent Card')
            ->where('stats.recent_cards.0.cost', 5)
            ->where('stats.recent_cards.0.world.name', 'Test World')
            ->where('stats.recent_cards.0.rarity.name', 'Rara')
        );
});
