<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard displays card counts by rarity', function () {
    $user = User::factory()->create();

    // World factory is missing, create manually
    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
    ]);

    // Create Rarities
    $common = Rarity::create(['name' => 'Common', 'description' => 'Common cards']);
    $rare = Rarity::create(['name' => 'Rare', 'description' => 'Rare cards']);

    // Create Cards
    // We use unguard because 'archetype' and 'card_type' are legacy non-nullable string columns
    // that are not in the $fillable array of the Card model.
    Card::unguard();

    Card::create([
        'world_id' => $world->id,
        'name' => 'Card 1',
        'illustration' => null,
        'effect' => 'Effect 1',
        'cost' => 1,
        'archetype' => 'Mago', // Legacy string column
        'card_type' => 'Criatura', // Legacy string column
        'rarity_id' => $common->id,
    ]);

    Card::create([
        'world_id' => $world->id,
        'name' => 'Card 2',
        'illustration' => null,
        'effect' => 'Effect 2',
        'cost' => 2,
        'archetype' => 'Guerrero',
        'card_type' => 'Hechizo',
        'rarity_id' => $common->id,
    ]);

    Card::create([
        'world_id' => $world->id,
        'name' => 'Card 3',
        'illustration' => null,
        'effect' => 'Effect 3',
        'cost' => 3,
        'archetype' => 'Pícaro',
        'card_type' => 'Artefacto',
        'rarity_id' => $rare->id,
    ]);

    Card::reguard();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity')
            ->where('stats.cards_by_rarity.Common', 2)
            ->where('stats.cards_by_rarity.Rare', 1)
        );
});
