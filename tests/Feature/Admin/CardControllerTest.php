<?php

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Character;
use App\Models\Edition;
use App\Models\Faction;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

test('index returns cards with optimized relationships', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['name' => 'Admin']);
    $user->assignRole($role);

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
    $character = Character::create(['name' => 'Test Character', 'biography' => 'Test Biography', 'world_id' => $world->id]);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test']);
    $rarity = Rarity::create(['name' => 'Common', 'color' => '#ffffff', 'description' => 'Test']);
    $archetype = Archetype::create(['name' => 'Test Archetype', 'description' => 'Test']);
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Test']);
    $faction = Faction::create(['name' => 'Test Faction', 'description' => 'Test']);
    $edition = Edition::create(['name' => 'Test Edition', 'release_date' => now(), 'description' => 'Test']);
    $artist = Artist::create(['name' => 'Test Artist', 'portfolio_url' => 'http://example.com', 'bio' => 'Test']);

    $card = Card::create([
        'name' => 'Test Card',
        'world_id' => $world->id,
        'character_id' => $character->id,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'faction_id' => $faction->id,
        'edition_id' => $edition->id,
        'artist_id' => $artist->id,
        'cost' => 1,
        'effect' => 'Test Effect',
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.cards.index'));

    $response->assertStatus(200);

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Cards/Index')
        ->has('cards.data', 1)
        ->has('cards.data.0', fn (Assert $json) => $json
            ->where('id', $card->id)
            ->where('name', 'Test Card')
            ->has('world', fn (Assert $json) => $json
                ->where('id', $world->id)
                ->where('name', 'Test World')
                ->etc()
            )
            ->has('character', fn (Assert $json) => $json
                ->where('id', $character->id)
                ->where('name', 'Test Character')
                ->etc()
            )
            ->has('card_type', fn (Assert $json) => $json
                ->where('id', $cardType->id)
                ->where('name', 'Test Type')
                ->etc()
            )
            ->has('rarity', fn (Assert $json) => $json
                ->where('id', $rarity->id)
                ->where('name', 'Common')
                ->etc()
            )
            ->etc()
        )
    );
});
