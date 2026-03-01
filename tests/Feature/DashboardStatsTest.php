<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('dashboard displays correct card rarity statistics', function () {
    $this->withoutVite();

    // The tables exist but missing some columns due to incomplete migration setups in the testing suite.
    // Use factory if possible or directly insert data in existing table schema
    DB::table('rarities')->insert([
        ['id' => 1, 'name' => 'Común', 'created_at' => now(), 'updated_at' => now()],
        ['id' => 2, 'name' => 'Raro', 'created_at' => now(), 'updated_at' => now()]
    ]);

    // Create dependencies to satisfy foreign keys
    DB::table('worlds')->insert([
        'id' => 1,
        'name' => 'World 1',
        'description' => 'A world',
        'created_at' => now(),
        'updated_at' => now()
    ]);

    DB::table('characters')->insert([
        'id' => 1,
        'name' => 'Char 1',
        'world_id' => 1,
        'biography' => 'A bio',
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Check table schema to see what's available
    $columns = Schema::getColumnListing('cards');

    // Default rarity created by factory/seeder might exist, so we start with a clean slate for cards
    DB::table('cards')->delete();

    // Prepare card payload based on schema
    $card1 = ['name' => 'Card 1', 'rarity_id' => 1, 'created_at' => now(), 'updated_at' => now()];
    $card2 = ['name' => 'Card 2', 'rarity_id' => 1, 'created_at' => now(), 'updated_at' => now()];
    $card3 = ['name' => 'Card 3', 'rarity_id' => 2, 'created_at' => now(), 'updated_at' => now()];

    // Add required non-nullable columns if they exist
    if (in_array('character_id', $columns)) {
        $card1['character_id'] = 1;
        $card2['character_id'] = 1;
        $card3['character_id'] = 1;
    }
    if (in_array('world_id', $columns)) {
        $card1['world_id'] = 1;
        $card2['world_id'] = 1;
        $card3['world_id'] = 1;
    }
    if (in_array('card_type', $columns)) {
        $card1['card_type'] = 'some';
        $card2['card_type'] = 'some';
        $card3['card_type'] = 'some';
    }
    if (in_array('rarity', $columns)) {
        $card1['rarity'] = 'some';
        $card2['rarity'] = 'some';
        $card3['rarity'] = 'some';
    }
    if (in_array('archetype', $columns)) {
        $card1['archetype'] = 'some';
        $card2['archetype'] = 'some';
        $card3['archetype'] = 'some';
    }
    if (in_array('effect', $columns)) {
        $card1['effect'] = 'some';
        $card2['effect'] = 'some';
        $card3['effect'] = 'some';
    }
    if (in_array('cost', $columns)) {
        $card1['cost'] = 1;
        $card2['cost'] = 1;
        $card3['cost'] = 1;
    }
    if (in_array('health', $columns)) {
        $card1['health'] = 1;
        $card2['health'] = 1;
        $card3['health'] = 1;
    }

    DB::table('cards')->insert([$card1, $card2, $card3]);

    $this->actingAs(User::factory()->create());

    $response = $this->get(route('dashboard'));

    $response->assertOk();

    $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
        ->component('dashboard')
        ->has('stats.cards_by_rarity', 2)
        ->where('stats.cards_by_rarity.Común', 2)
        ->where('stats.cards_by_rarity.Raro', 1)
    );
});
