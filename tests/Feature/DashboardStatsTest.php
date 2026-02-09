<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard stats are correct', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create World
    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

    // Create Rarities
    $common = Rarity::create(['name' => 'Común']);
    $rare = Rarity::create(['name' => 'Rara']);

    // Create Card Type
    $cardType = \App\Models\CardType::create(['name' => 'Test Type']);

    // Create Cards
    $c1 = Card::create([
        'name' => 'Card 1',
        'world_id' => $world->id,
        'rarity_id' => $common->id,
        'cost' => 1,
        'effect' => 'Effect 1',
        'card_type_id' => $cardType->id,
        'strength' => 1,
        'defense' => 1,
        'health' => 1,
    ]);
    $c1->created_at = now()->subMinutes(3);
    $c1->save();

    $c2 = Card::create([
        'name' => 'Card 2',
        'world_id' => $world->id,
        'rarity_id' => $common->id,
        'cost' => 2,
        'effect' => 'Effect 2',
        'card_type_id' => $cardType->id,
        'strength' => 1,
        'defense' => 1,
        'health' => 1,
    ]);
    $c2->created_at = now()->subMinutes(2);
    $c2->save();

    $c3 = Card::create([
        'name' => 'Card 3',
        'world_id' => $world->id,
        'rarity_id' => $rare->id,
        'cost' => 3,
        'effect' => 'Effect 3',
        'card_type_id' => $cardType->id,
        'strength' => 1,
        'defense' => 1,
        'health' => 1,
    ]);
    $c3->created_at = now()->subMinutes(1);
    $c3->save();

    $response = $this->get(route('dashboard'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('stats', fn (Assert $stats) => $stats
            ->where('cards_by_rarity.Común', 2)
            ->where('cards_by_rarity.Rara', 1)
            ->has('recent_cards', 3)
            ->where('recent_cards.0.name', 'Card 3')
            ->etc()
        )
    );
});
