<?php

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('dashboard stats include cards by rarity', function () {
    $this->withoutVite();

    $user = User::factory()->create();

    $common = Rarity::create(['name' => 'Common']);
    $rare = Rarity::create(['name' => 'Rare']);

    // Temporarily add rarity_id column as per memory instructions
    \Illuminate\Support\Facades\Schema::table('cards', function ($table) {
        if (! \Illuminate\Support\Facades\Schema::hasColumn('cards', 'rarity_id')) {
            $table->integer('rarity_id')->nullable();
        }
    });

    $world = World::create(['name' => 'World 1', 'description' => 'Test']);

    $commonCardParams = [
        'world_id' => $world->id,
        'character_id' => null,
        'card_type' => 'test',
        'archetype' => 'test',
        'effect' => 'test',
        'cost' => 1,
        'rarity' => 'comun',
    ];

    Card::forceCreate(array_merge($commonCardParams, ['name' => 'Card 1', 'rarity_id' => $common->id]));
    Card::forceCreate(array_merge($commonCardParams, ['name' => 'Card 2', 'rarity_id' => $common->id]));
    Card::forceCreate(array_merge($commonCardParams, ['name' => 'Card 3', 'rarity_id' => $rare->id]));

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('dashboard')
        ->has('stats.cards_by_rarity', function ($prop) {
            $prop->where('Common', 2)
                ->where('Rare', 1);
        })
    );
});
