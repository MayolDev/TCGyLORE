<?php

use App\Models\User;
use App\Models\Card;
use App\Models\World;
use App\Models\Character;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Archetype;
use App\Models\Alignment;
use App\Models\Faction;
use App\Models\Edition;
use App\Models\Artist;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    // Crear roles
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('los administradores pueden ver la lista de cartas', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create dependencies
    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description'
    ]);

    $character = Character::create([
        'world_id' => $world->id,
        'name' => 'Test Character',
        'biography' => 'Test Bio',
        'alignment' => 'neutral'
    ]);

    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'comun', 'description' => 'Desc']);
    $archetype = Archetype::create(['name' => 'Test Archetype', 'description' => 'Desc']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Desc']);
    $faction = Faction::create(['name' => 'Test Faction', 'description' => 'Desc']);
    $edition = Edition::create(['name' => 'Test Edition', 'description' => 'Desc']);
    $artist = Artist::create(['name' => 'Test Artist', 'bio' => 'Bio']);

    $card = Card::create([
        'world_id' => $world->id,
        'character_id' => $character->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 5,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'faction_id' => $faction->id,
        'edition_id' => $edition->id,
        'artist_id' => $artist->id,
        'strength' => 10,
        'agility' => 10,
        'charisma' => 10,
        'mind' => 10,
        'defense' => 5,
        'magic_defense' => 5,
        'health' => 50,
    ]);

    // Force created_at to be recent so latest() puts it first (though it's the only one)
    $card->created_at = now();
    $card->save();

    $response = $this->actingAs($admin)->get(route('admin.cards.index'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Cards/Index')
        ->has('cards.data', 1)
        ->where('cards.data.0.id', $card->id)
        ->where('cards.data.0.name', 'Test Card')
        ->where('cards.data.0.world.name', 'Test World')
        ->where('cards.data.0.character.name', 'Test Character')
        ->where('cards.data.0.card_type.name', 'Test Type')
        ->where('cards.data.0.rarity.name', 'comun')
    );
});
