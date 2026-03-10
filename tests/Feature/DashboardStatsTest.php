<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('dashboard stats structure and accuracy', function () {
    $this->actingAs($user = User::factory()->create());

    // Let's use the DB schema facade to add the column for testing because rarity_id is missing in testing migration
    \Illuminate\Support\Facades\Schema::table('cards', function (\Illuminate\Database\Schema\Blueprint $table) {
        $table->foreignId('rarity_id')->nullable();
        $table->foreignId('world_id')->nullable()->change();
    });

    $commonRarity = Rarity::forceCreate(['name' => 'Común']);
    $rareRarity = Rarity::forceCreate(['name' => 'Rara']);

    Card::forceCreate(['name' => 'Card 1', 'rarity_id' => $commonRarity->id, 'card_type' => 'test', 'rarity' => 'test', 'archetype' => 'test', 'cost' => 1, 'effect' => 'test']);
    Card::forceCreate(['name' => 'Card 2', 'rarity_id' => $commonRarity->id, 'card_type' => 'test', 'rarity' => 'test', 'archetype' => 'test', 'cost' => 1, 'effect' => 'test']);
    Card::forceCreate(['name' => 'Card 3', 'rarity_id' => $rareRarity->id, 'card_type' => 'test', 'rarity' => 'test', 'archetype' => 'test', 'cost' => 1, 'effect' => 'test']);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('dashboard')
        ->has('stats.cards_by_rarity', fn ($page) => $page
            ->where('Común', 2)
            ->where('Rara', 1)
        )
    );
});
