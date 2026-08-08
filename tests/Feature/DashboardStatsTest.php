<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\World;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard stats are calculated correctly', function () {
    // Create User
    $user = User::factory()->create();

    // Create Metadata
    $world = World::create(['name' => 'World 1', 'slug' => 'world-1', 'description' => 'Desc']);
    $common = Rarity::create(['name' => 'Common', 'description' => 'Common Rarity']);
    $rare = Rarity::create(['name' => 'Rare', 'description' => 'Rare Rarity']);

    // Create Cards
    // Time travel is tricky with created_at, so we'll just create them sequentially and rely on latest()

    // 3 Common cards
    $c1 = Card::create(['world_id' => $world->id, 'rarity_id' => $common->id, 'name' => 'Card 1', 'cost' => 1, 'effect' => 'Effect 1']);
    $c1->created_at = now()->subMinutes(6); $c1->save();

    $c2 = Card::create(['world_id' => $world->id, 'rarity_id' => $common->id, 'name' => 'Card 2', 'cost' => 2, 'effect' => 'Effect 2']);
    $c2->created_at = now()->subMinutes(5); $c2->save();

    $c3 = Card::create(['world_id' => $world->id, 'rarity_id' => $common->id, 'name' => 'Card 3', 'cost' => 3, 'effect' => 'Effect 3']);
    $c3->created_at = now()->subMinutes(4); $c3->save();

    // 2 Rare cards
    $c4 = Card::create(['world_id' => $world->id, 'rarity_id' => $rare->id, 'name' => 'Card 4', 'cost' => 4, 'effect' => 'Effect 4']);
    $c4->created_at = now()->subMinutes(3); $c4->save();

    $c5 = Card::create(['world_id' => $world->id, 'rarity_id' => $rare->id, 'name' => 'Card 5', 'cost' => 5, 'effect' => 'Effect 5']);
    $c5->created_at = now()->subMinutes(2); $c5->save();

    // 1 Card without rarity
    $c6 = Card::create(['world_id' => $world->id, 'rarity_id' => null, 'name' => 'Card 6', 'cost' => 6, 'effect' => 'Effect 6']);
    $c6->created_at = now()->subMinutes(1); $c6->save();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity', 2)
            ->where('stats.cards_by_rarity.Common', 3)
            ->where('stats.cards_by_rarity.Rare', 2)
            ->has('stats.recent_cards', 5)
            ->where('stats.recent_cards.0.name', 'Card 6')
            ->where('stats.recent_cards.1.name', 'Card 5')
            ->where('stats.recent_cards.2.name', 'Card 4')
            ->where('stats.recent_cards.3.name', 'Card 3')
            ->where('stats.recent_cards.4.name', 'Card 2')
        );
});
