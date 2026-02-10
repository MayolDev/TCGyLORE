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
        // Optimization: Use DB aggregation instead of hydrating all models
        $cardsByRarity = Card::join('rarities', 'cards.rarity_id', '=', 'rarities.id')
            ->select('rarities.name', \DB::raw('count(*) as count'))
            ->groupBy('rarities.name')
            ->pluck('count', 'rarities.name')
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
            // Optimization: Select only needed columns and relations
            'recent_cards' => Card::with([
                'world:id,name',
                'rarity:id,name',
            ])
                ->select(['id', 'name', 'cost', 'world_id', 'rarity_id', 'created_at'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
