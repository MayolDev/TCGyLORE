<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\World;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('dashboard stats are calculated correctly', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create World
    $world = World::create([
        'name' => 'Test World',
        'slug' => 'test-world',
        'description' => 'Test Description'
    ]);

    // Create Rarities
    $common = Rarity::create(['name' => 'Común', 'description' => 'Common']);
    $rare = Rarity::create(['name' => 'Rara', 'description' => 'Rare']);

    // Create Cards
    Card::unguard();

    // 2 Common
    Card::create([
        'world_id' => $world->id,
        'rarity_id' => $common->id,
        'name' => 'Card 1',
        'cost' => 1,
        'effect' => 'Effect',
        'illustration' => 'test.jpg',
        'strength' => 1,
        'agility' => 1,
        'charisma' => 1,
        'mind' => 1,
        'defense' => 1,
        'magic_defense' => 1,
        'health' => 1,
        'archetype' => 'Warrior',
        'card_type' => 'Creature',
        'alignment' => 'neutral',
        'rarity' => 'comun',
    ]);
    Card::create([
        'world_id' => $world->id,
        'rarity_id' => $common->id,
        'name' => 'Card 2',
        'cost' => 2,
        'effect' => 'Effect',
        'illustration' => 'test.jpg',
        'strength' => 1,
        'agility' => 1,
        'charisma' => 1,
        'mind' => 1,
        'defense' => 1,
        'magic_defense' => 1,
        'health' => 1,
        'archetype' => 'Warrior',
        'card_type' => 'Creature',
        'alignment' => 'neutral',
        'rarity' => 'comun',
    ]);

    // 1 Rare
    // Manually force a later timestamp
    $card3 = Card::create([
        'world_id' => $world->id,
        'rarity_id' => $rare->id,
        'name' => 'Card 3',
        'cost' => 3,
        'effect' => 'Effect',
        'illustration' => 'test.jpg',
        'strength' => 1,
        'agility' => 1,
        'charisma' => 1,
        'mind' => 1,
        'defense' => 1,
        'magic_defense' => 1,
        'health' => 1,
        'archetype' => 'Warrior',
        'card_type' => 'Creature',
        'alignment' => 'neutral',
        'rarity' => 'rara',
    ]);

    // Ensure Card 3 is the most recent
    $card3->created_at = now()->addMinute();
    $card3->save();

    Card::reguard();

    $this->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity', function (Assert $json) {
                $json->where('Común', 2)
                     ->where('Rara', 1);
            })
            ->has('stats.recent_cards', 3)
            ->where('stats.recent_cards.0.name', 'Card 3')
        );
});
