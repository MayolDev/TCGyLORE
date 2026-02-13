<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\World;
use App\Models\Rarity;
use App\Models\CardType;
use App\Models\Archetype;
use App\Models\Card;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardStatsRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_are_correct()
    {
        $user = User::factory()->create();

        $world = World::create([
            'name' => 'Test World',
            'slug' => 'test-world',
            'description' => 'Desc',
            'user_id' => $user->id
        ]);

        $rarityCommon = Rarity::create(['name' => 'Common']);
        $rarityRare = Rarity::create(['name' => 'Rare']);
        $cardType = CardType::create(['name' => 'Type1']);
        $archetype = Archetype::create(['name' => 'Arch1']);

        Card::create([
            'world_id' => $world->id,
            'name' => 'Card 1',
            'effect' => 'Effect 1',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarityCommon->id,
            'archetype_id' => $archetype->id,
        ]);

        Card::create([
            'world_id' => $world->id,
            'name' => 'Card 2',
            'effect' => 'Effect 2',
            'cost' => 2,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarityCommon->id,
            'archetype_id' => $archetype->id,
        ]);

        Card::create([
            'world_id' => $world->id,
            'name' => 'Card 3',
            'effect' => 'Effect 3',
            'cost' => 3,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarityRare->id,
            'archetype_id' => $archetype->id,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();

        $page = $response->original;
        $props = $page->getData()['page']['props'];
        $stats = $props['stats'];

        $this->assertArrayHasKey('cards_by_rarity', $stats);
        $this->assertEquals(2, $stats['cards_by_rarity']['Common']);
        $this->assertEquals(1, $stats['cards_by_rarity']['Rare']);
    }
}
