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
        // ⚡ Bolt: Optimize calculation by grouping and counting in the database instead of loading all models into PHP memory
        // Expected impact: Dramatically lower memory usage (O(1) vs O(N)) when calculating dashboard stats
        $cardsByRarity = Card::whereNotNull('rarity_id')
            ->select('rarity_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('rarity_id')
            ->with('rarity')
            ->get()
            ->groupBy(fn ($item) => $item->rarity?->name ?? 'Sin rareza')
            ->map(fn ($group) => $group->sum('count'))
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
            'recent_cards' => Card::with(['world', 'character', 'rarity', 'cardType', 'alignment'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
