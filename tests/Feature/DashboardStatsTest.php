<?php

namespace Tests\Feature;

use App\Models\Archetype;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_displays_correct_card_rarity_stats()
    {
        $user = User::factory()->create();

        // Create requisite foreign keys
        $world = World::forceCreate([
            'name' => 'Test World',
            'description' => 'A test world',
        ]);

        $cardType = CardType::forceCreate([
            'name' => 'Personaje',
        ]);

        $archetype = Archetype::forceCreate([
            'name' => 'Guerrero',
        ]);

        $rarityCommon = Rarity::forceCreate([
            'name' => 'Común',
        ]);

        $rarityRare = Rarity::forceCreate([
            'name' => 'Rara',
        ]);

        // Create 3 Common cards
        for ($i = 0; $i < 3; $i++) {
            Card::forceCreate([
                'name' => "Common Card $i",
                'world_id' => $world->id,
                'card_type_id' => $cardType->id,
                'rarity_id' => $rarityCommon->id,
                // Legacy non-nullable columns required by DB constraint
                'card_type' => 'Personaje',
                'rarity' => 'Común',
                'archetype' => 'Guerrero',
                'cost' => 1,
                'effect' => 'Some effect',
            ]);
        }

        // Create 2 Rare cards
        for ($i = 0; $i < 2; $i++) {
            Card::forceCreate([
                'name' => "Rare Card $i",
                'world_id' => $world->id,
                'card_type_id' => $cardType->id,
                'rarity_id' => $rarityRare->id,
                // Legacy non-nullable columns required by DB constraint
                'card_type' => 'Personaje',
                'rarity' => 'Rara',
                'archetype' => 'Guerrero',
                'cost' => 1,
                'effect' => 'Some effect',
            ]);
        }

        // Create 1 Card without rarity_id (should be ignored by the query)
        Card::forceCreate([
            'name' => 'No Rarity Card',
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => null,
            // Legacy non-nullable columns required by DB constraint
            'card_type' => 'Personaje',
            'rarity' => 'Sin Rareza',
            'archetype' => 'Guerrero',
            'cost' => 1,
            'effect' => 'Some effect',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity', fn (Assert $prop) => $prop
                ->where('Común', 3)
                ->where('Rara', 2)
                ->missing('Sin rareza')
            )
        );
    }
}
