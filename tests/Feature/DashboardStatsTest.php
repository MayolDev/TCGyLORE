<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_include_cards_by_rarity()
    {
        // Setup dependencies
        $world = World::create(['name' => 'Test World', 'description' => 'Desc', 'is_active' => true]);
        $rarityCommon = Rarity::create(['name' => 'Common', 'description' => 'Common cards']);
        $rarityRare = Rarity::create(['name' => 'Rare', 'description' => 'Rare cards']);

        // Create Cards
        Card::create([
            'world_id' => $world->id,
            'name' => 'Card 1',
            'effect' => 'Effect 1',
            'cost' => 1,
            'rarity_id' => $rarityCommon->id,
        ]);

        Card::create([
            'world_id' => $world->id,
            'name' => 'Card 2',
            'effect' => 'Effect 2',
            'cost' => 2,
            'rarity_id' => $rarityCommon->id,
        ]);

        Card::create([
            'world_id' => $world->id,
            'name' => 'Card 3',
            'effect' => 'Effect 3',
            'cost' => 3,
            'rarity_id' => $rarityRare->id,
        ]);

        $this->actingAs($user = User::factory()->create());

        $response = $this->get(route('dashboard'));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats', fn (Assert $stats) => $stats
                ->where('cards_by_rarity.Common', 2)
                ->where('cards_by_rarity.Rare', 1)
                ->etc()
            )
        );
    }
}
