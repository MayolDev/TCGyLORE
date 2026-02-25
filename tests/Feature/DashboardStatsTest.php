<?php

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Edition;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('dashboard stats show correct card counts by rarity', function () {
    // Authenticate as a user
    $this->actingAs($user = User::factory()->create());

    // Create necessary dependencies
    $world = World::create([
        'name' => 'WorldTest',
        'description' => 'DescriptionTest',
    ]);
    $commonRarity = Rarity::create(['name' => 'Común']);
    $rareRarity = Rarity::create(['name' => 'Rara']);

    // Create dummy dependencies for foreign keys
    $cardType = CardType::create(['name' => 'TipoTest']);
    $archetype = Archetype::create(['name' => 'ArchetypeTest']);
    $alignment = Alignment::create(['name' => 'AlignmentTest']);
    $artist = Artist::create(['name' => 'ArtistTest']);
    $edition = Edition::create(['name' => 'EditionTest']);

    // Create cards with specific rarities
    // Use forceCreate to handle non-nullable legacy columns not in $fillable
    Card::forceCreate([
        'world_id' => $world->id,
        'rarity_id' => $commonRarity->id,
        'name' => 'Common Card 1',
        'cost' => 1,
        'effect' => 'Effect',
        'card_type_id' => $cardType->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'artist_id' => $artist->id,
        'edition_id' => $edition->id,
        // Legacy string columns that might be required
        'card_type' => 'TipoTest',
        'archetype' => 'ArchetypeTest',
        'rarity' => 'comun', // Enum value
    ]);

    Card::forceCreate([
        'world_id' => $world->id,
        'rarity_id' => $commonRarity->id,
        'name' => 'Common Card 2',
        'cost' => 1,
        'effect' => 'Effect',
        'card_type_id' => $cardType->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'artist_id' => $artist->id,
        'edition_id' => $edition->id,
        'card_type' => 'TipoTest',
        'archetype' => 'ArchetypeTest',
        'rarity' => 'comun',
    ]);

    Card::forceCreate([
        'world_id' => $world->id,
        'rarity_id' => $rareRarity->id,
        'name' => 'Rare Card 1',
        'cost' => 1,
        'effect' => 'Effect',
        'card_type_id' => $cardType->id,
        'archetype_id' => $archetype->id,
        'alignment_id' => $alignment->id,
        'artist_id' => $artist->id,
        'edition_id' => $edition->id,
        'card_type' => 'TipoTest',
        'archetype' => 'ArchetypeTest',
        'rarity' => 'rara',
    ]);

    // Make request to dashboard
    $response = $this->get(route('dashboard'));

    // Assert response status
    $response->assertOk();

    // Assert Inertia props
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('stats', fn (Assert $stats) => $stats
            ->has('cards_by_rarity')
            ->where('cards_by_rarity.Común', 2)
            ->where('cards_by_rarity.Rara', 1)
            ->etc()
        )
    );
});
