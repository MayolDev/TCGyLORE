<?php

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Edition;
use App\Models\Faction;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('dashboard displays correct card stats', function () {
    $user = User::factory()->create();

    // Create dependencies
    $world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'A test world']);

    // Create rarities
    $rarityCommon = Rarity::create(['name' => 'Comun', 'description' => 'Common rarity']);
    $rarityRare = Rarity::create(['name' => 'Rara', 'description' => 'Rare rarity']);

    // Create card types
    $cardType = CardType::create(['name' => 'Spell', 'description' => 'Magic spell']);

    // Create archetype
    $archetype = Archetype::create(['name' => 'Warrior', 'description' => 'Strong warrior']);

    // Create alignment
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Balanced']);

    // Create faction
    $faction = Faction::create(['name' => 'Rebels', 'description' => 'Rebel forces']);

    // Create edition
    $edition = Edition::create(['name' => 'First Edition', 'description' => 'Original set']);

    // Create artist
    $artist = Artist::create(['name' => 'Da Vinci', 'slug' => 'da-vinci', 'bio' => 'Famous painter']);

    // Create Cards
    // 2 Common cards
    $card1 = Card::create([
        'name' => 'Common Card 1',
        'world_id' => $world->id,
        'rarity_id' => $rarityCommon->id,
        'card_type_id' => $cardType->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'faction_id' => $faction->id,
        'edition_id' => $edition->id,
        'artist_id' => $artist->id,
        'cost' => 1,
        'effect' => 'Effect 1',
        'flavor_text' => 'Flavor 1',
        'strength' => 10,
        'agility' => 10,
        'charisma' => 10,
        'mind' => 10,
        'defense' => 10,
        'magic_defense' => 10,
        'health' => 10,
    ]);
    $card1->created_at = now()->subDays(2);
    $card1->save();

    $card2 = Card::create([
        'name' => 'Common Card 2',
        'world_id' => $world->id,
        'rarity_id' => $rarityCommon->id, // Second common card
        'card_type_id' => $cardType->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'faction_id' => $faction->id,
        'edition_id' => $edition->id,
        'artist_id' => $artist->id,
        'cost' => 2,
        'effect' => 'Effect 2',
        'flavor_text' => 'Flavor 2',
        'strength' => 10,
        'agility' => 10,
        'charisma' => 10,
        'mind' => 10,
        'defense' => 10,
        'magic_defense' => 10,
        'health' => 10,
    ]);
    $card2->created_at = now()->subDay();
    $card2->save();

    // 1 Rare card
    $card3 = Card::create([
        'name' => 'Rare Card 1',
        'world_id' => $world->id,
        'rarity_id' => $rarityRare->id,
        'card_type_id' => $cardType->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'faction_id' => $faction->id,
        'edition_id' => $edition->id,
        'artist_id' => $artist->id,
        'cost' => 5,
        'effect' => 'Effect 3',
        'flavor_text' => 'Flavor 3',
        'strength' => 10,
        'agility' => 10,
        'charisma' => 10,
        'mind' => 10,
        'defense' => 10,
        'magic_defense' => 10,
        'health' => 10,
    ]);
    $card3->created_at = now();
    $card3->save();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity', 2)
            ->where('stats.cards_by_rarity.Comun', 2) // 2 Common cards
            ->where('stats.cards_by_rarity.Rara', 1)  // 1 Rare card
            ->has('stats.recent_cards', 3) // 3 cards total (all recent)
            ->where('stats.recent_cards.0.name', 'Rare Card 1') // Most recent (created last)
            ->where('stats.recent_cards.0.world.name', 'Test World')
            ->where('stats.recent_cards.0.rarity.name', 'Rara')
            ->has('stats.recent_cards.0.id')
            ->has('stats.recent_cards.0.cost')
        );
});
