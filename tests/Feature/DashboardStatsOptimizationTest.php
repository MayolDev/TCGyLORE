<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardStatsOptimizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_aggregation_logic()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Manually create World
        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test Description',
            'is_active' => true,
        ]);

        // Manually create Rarities
        $rarityCommon = Rarity::create(['name' => 'Comun', 'description' => 'Common Rarity']);
        $rarityRare = Rarity::create(['name' => 'Rara', 'description' => 'Rare Rarity']);

        // Manually create CardType
        $cardType = CardType::create(['name' => 'Unit', 'description' => 'Unit Type']);

        // Create cards manually since no factory exists
        // Common Card 1
        $card1 = new Card;
        $card1->world_id = $world->id;
        $card1->name = 'Common Card 1';
        $card1->effect = 'Effect 1';
        $card1->cost = 1;
        $card1->archetype = 'Warrior';
        $card1->card_type = 'Unit'; // Legacy column
        // $card1->card_type_id = $cardType->id;
        $card1->rarity = 'comun'; // Legacy column
        $card1->rarity_id = $rarityCommon->id; // Relation
        $card1->save();

        // Common Card 2
        $card2 = new Card;
        $card2->world_id = $world->id;
        $card2->name = 'Common Card 2';
        $card2->effect = 'Effect 2';
        $card2->cost = 1;
        $card2->archetype = 'Warrior';
        $card2->card_type = 'Unit';
        // $card2->card_type_id = $cardType->id;
        $card2->rarity = 'comun';
        $card2->rarity_id = $rarityCommon->id;
        $card2->save();

        // Rare Card
        $card3 = new Card;
        $card3->world_id = $world->id;
        $card3->name = 'Rare Card';
        $card3->effect = 'Effect 3';
        $card3->cost = 2;
        $card3->archetype = 'Mage';
        $card3->card_type = 'Unit';
        // $card3->card_type_id = $cardType->id;
        $card3->rarity = 'rara';
        $card3->rarity_id = $rarityRare->id;
        $card3->save();

        $response = $this->get(route('dashboard'));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity')
        );

        // Check the stats in the Inertia prop directly
        $page = $response->viewData('page');
        $stats = $page['props']['stats'];
        $cardsByRarity = $stats['cards_by_rarity'];

        // Verify the optimization returns correct counts by rarity name
        $this->assertEquals(2, $cardsByRarity['Comun'] ?? 0);
        $this->assertEquals(1, $cardsByRarity['Rara'] ?? 0);
    }
}
