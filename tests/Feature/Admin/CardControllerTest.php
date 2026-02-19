<?php

use App\Models\Alignment;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Crear roles
    Role::firstOrCreate(['name' => 'Admin']);

    // Crear dependencias
    $this->world = World::create([
        'name' => 'Test World',
        'description' => 'Test World Description',
        'is_active' => true,
    ]);

    $this->cardType = CardType::create(['name' => 'Test Type']);
    $this->rarity = Rarity::create(['name' => 'Test Rarity']);
    $this->alignment = Alignment::create(['name' => 'Test Alignment']);

    // Crear usuario admin
    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');
});

test('index returns successful response', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.cards.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Cards/Index')
        ->has('cards.data')
    );
});

test('index returns correct card data', function () {
    // Crear carta
    $card = Card::forceCreate([
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 5,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
        // Legacy required columns
        'card_type' => 'legacy_type',
        'archetype' => 'legacy_archetype',
    ]);

    // Set created_at explicitly for latest() sort
    $card->created_at = now();
    $card->save();

    $response = $this->actingAs($this->admin)->get(route('admin.cards.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Cards/Index')
        ->has('cards.data', 1)
        ->where('cards.data.0.name', 'Test Card')
        ->where('cards.data.0.world.name', 'Test World')
        ->where('cards.data.0.rarity.name', 'Test Rarity')
        ->where('cards.data.0.card_type.name', 'Test Type')
    );
});

test('index filters by search', function () {
    Card::forceCreate([
        'world_id' => $this->world->id,
        'name' => 'Alpha Card',
        'effect' => 'Effect',
        'cost' => 1,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
        'card_type' => 'legacy',
        'archetype' => 'legacy',
    ]);

    Card::forceCreate([
        'world_id' => $this->world->id,
        'name' => 'Beta Card',
        'effect' => 'Effect',
        'cost' => 2,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
        'card_type' => 'legacy',
        'archetype' => 'legacy',
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.cards.index', ['search' => 'Alpha']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->has('cards.data', 1)
        ->where('cards.data.0.name', 'Alpha Card')
    );
});
