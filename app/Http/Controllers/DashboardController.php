<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Character;
use App\Models\Location;
use App\Models\Story;
use App\Models\TimelineEvent;
use App\Models\User;
use App\Models\World;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Optimized: Use database aggregation instead of hydrating all card models and grouping in memory.
        // This reduces memory usage and avoids N+1 query issues.
        $cardsByRarity = Card::join('rarities', 'cards.rarity_id', '=', 'rarities.id')
            ->selectRaw('rarities.name as rarity_name, count(*) as count')
            ->groupBy('rarities.name')
            ->pluck('count', 'rarity_name')
            ->toArray();

        $stats = [
            'worlds' => World::count(),
            'stories' => Story::count(),
            'characters' => Character::count(),
            'locations' => Location::count(),
            'timeline_events' => TimelineEvent::count(),
            'cards' => Card::count(),
            'users' => User::count(),
            'cards_by_rarity' => $cardsByRarity,
            // Optimized: Select only necessary columns and relationships to avoid fetching large text fields (like 'effect').
            // Also fixes a naming conflict between 'rarity' column and 'rarity()' relationship.
            'recent_cards' => Card::with(['world:id,name', 'rarity:id,name'])
                ->select('id', 'name', 'cost', 'world_id', 'rarity_id', 'created_at')
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
