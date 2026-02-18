<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Character;
use App\Models\Location;
use App\Models\Story;
use App\Models\TimelineEvent;
use App\Models\User;
use App\Models\World;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Optimize: Use database aggregation instead of hydrating all models
        $cardsByRarity = Card::join('rarities', 'cards.rarity_id', '=', 'rarities.id')
            ->select('rarities.name as rarity_name', DB::raw('count(*) as count'))
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
            // Optimize: Select only necessary columns to avoid 'rarity' column conflict and reduce data
            'recent_cards' => Card::select('id', 'name', 'cost', 'world_id', 'rarity_id', 'created_at')
                ->with(['world:id,name', 'rarity:id,name'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
