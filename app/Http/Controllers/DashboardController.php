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
        // ⚡ Bolt: Optimize cards by rarity calculation
        // Replaced O(N) memory grouping with database-level counting using O(R) memory
        $cardsByRarity = Card::select('rarity_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('rarity_id')
            ->groupBy('rarity_id')
            ->with('rarity:id,name')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->rarity?->name ?? 'Sin rareza' => $item->count])
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
            // ⚡ Bolt: Optimize recent_cards query payload
            // Reduced eager loading from 5 full relations to 2 sparse relations needed by UI
            'recent_cards' => Card::with(['world:id,name', 'rarity:id,name'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
