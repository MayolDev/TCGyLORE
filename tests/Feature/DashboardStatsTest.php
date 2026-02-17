<?php

namespace Tests\Feature;

use App\Models\Alignment;
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

    public function test_dashboard_stats_are_aggregated_correctly()
    {
        Card::unguard();

        // Setup taxonomies
        $common = Rarity::create(['name' => 'Comun', 'description' => 'Common rarity']);
        $rare = Rarity::create(['name' => 'Rara', 'description' => 'Rare rarity']);
        $epic = Rarity::create(['name' => 'Epica', 'description' => 'Epic rarity']);

        $cardType = CardType::create(['name' => 'Unit', 'description' => 'Unit type']);
        $archetype = Archetype::create(['name' => 'Soldier', 'description' => 'Soldier archetype']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Neutral alignment']);

        $world = World::create([
            'name' => 'Test World',
            'description' => 'A test world',
            'is_active' => true,
        ]);

        // Create user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create Cards
        // 3 Common cards
        for ($i = 0; $i < 3; $i++) {
            Card::create([
                'world_id' => $world->id,
                'name' => "Common Card $i",
                'rarity_id' => $common->id,
                'card_type_id' => $cardType->id,
                'archetype_id' => $archetype->id,
                'alignment_id' => $alignment->id,
                'cost' => 1,
                'effect' => 'Test Effect',
                'rarity' => 'comun', // legacy enum column
                'card_type' => 'Unit', // legacy column
                'archetype' => 'Soldier', // legacy column
                'alignment' => 'neutral', // legacy enum column
            ]);
        }

        // 2 Rare cards
        for ($i = 0; $i < 2; $i++) {
            Card::create([
                'world_id' => $world->id,
                'name' => "Rare Card $i",
                'rarity_id' => $rare->id,
                'card_type_id' => $cardType->id,
                'archetype_id' => $archetype->id,
                'alignment_id' => $alignment->id,
                'cost' => 2,
                'effect' => 'Test Effect',
                'rarity' => 'rara',
                'card_type' => 'Unit',
                'archetype' => 'Soldier',
                'alignment' => 'neutral',
            ]);
        }

        // 1 Epic card
        Card::create([
            'world_id' => $world->id,
            'name' => 'Epic Card',
            'rarity_id' => $epic->id,
            'card_type_id' => $cardType->id,
            'archetype_id' => $archetype->id,
            'alignment_id' => $alignment->id,
            'cost' => 3,
            'effect' => 'Test Effect',
            'rarity' => 'epica',
            'card_type' => 'Unit',
            'archetype' => 'Soldier',
            'alignment' => 'neutral',
        ]);

        Card::reguard();

        // Make request to dashboard
        $response = $this->get(route('dashboard'));

        $response->assertOk();

        // Verify Inertia props
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.cards_by_rarity', function (Assert $stats) {
                $stats->where('Comun', 3)
                    ->where('Rara', 2)
                    ->where('Epica', 1);
            })
            ->has('stats.recent_cards', 5) // Should show 5 most recent cards (we created 6, but limit is 5)
            ->where('stats.cards', 6)
        );
    }
}
