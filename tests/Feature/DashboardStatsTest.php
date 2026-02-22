<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_displays_correct_card_stats_by_rarity_and_recent_cards()
    {
        // Setup
        $user = User::factory()->create();
        $this->actingAs($user);

        // Ensure Rarity models exist
        $common = Rarity::create(['name' => 'Common', 'description' => 'Common cards']);
        $rare = Rarity::create(['name' => 'Rare', 'description' => 'Rare cards']);

        // Create a world (required by Card)
        $world = World::create(['name' => 'Test World', 'description' => 'Test Description', 'slug' => 'test-world', 'user_id' => $user->id]);

        // Create cards
        Card::unguard();

        // 2 Common cards
        $card1 = Card::create([
            'name' => 'Card 1',
            'cost' => 1,
            'world_id' => $world->id,
            'rarity_id' => $common->id,
            'card_type' => 'Creature',
            'archetype' => 'Warrior',
            'effect' => 'Effect 1',
        ]);
        // Manually set created_at to ensure order
        $card1->created_at = now()->subMinutes(10);
        $card1->save();

        $card2 = Card::create([
            'name' => 'Card 2',
            'cost' => 1,
            'world_id' => $world->id,
            'rarity_id' => $common->id,
            'card_type' => 'Creature',
            'archetype' => 'Warrior',
            'effect' => 'Effect 2',
        ]);
        $card2->created_at = now()->subMinutes(5);
        $card2->save();

        // 1 Rare card
        $card3 = Card::create([
            'name' => 'Card 3',
            'cost' => 2,
            'world_id' => $world->id,
            'rarity_id' => $rare->id,
            'card_type' => 'Spell',
            'archetype' => 'Mage',
            'effect' => 'Effect 3',
        ]);
        $card3->created_at = now();
        $card3->save();

        Card::reguard();

        // Act
        $response = $this->get('/dashboard');

        // Assert
        $response->assertOk();

        // Assert Inertia props
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            // Verify aggregated stats
            ->where('stats.cards_by_rarity.Common', 2)
            ->where('stats.cards_by_rarity.Rare', 1)
            // Verify recent cards and rarity relationship
            ->has('stats.recent_cards', 3)
            ->has('stats.recent_cards.0', fn (AssertableInertia $card) => $card
                ->where('name', 'Card 3')
                ->has('rarity', fn (AssertableInertia $rarity) => $rarity
                    ->where('name', 'Rare')
                    ->etc()
                )
                ->etc()
            )
        );
    }
}
