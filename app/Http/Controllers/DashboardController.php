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
        // ⚡ Bolt: Use database aggregation instead of pulling all records into memory
        // This transforms an O(N) memory/compute operation into an O(R) operation (where R is number of rarities)
        $cardsByRarity = Card::select('rarity_id', DB::raw('count(*) as count'))
            ->whereNotNull('rarity_id')
            ->groupBy('rarity_id')
            ->with('rarity:id,name')
            ->get()
            ->mapWithKeys(function ($item) {
                // Safely access the shadowed rarity relationship
                $name = $item->relationLoaded('rarity') && $item->getRelation('rarity')
                    ? $item->getRelation('rarity')->name
                    : 'Sin rareza';
                return [$name => $item->count];
            })
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
            // ⚡ Bolt: Select only needed columns in eager loading to reduce memory and CPU overhead
            'recent_cards' => Card::with([
                'world:id,name',
                'character:id,name',
                'rarity:id,name',
                'cardType:id,name',
                'alignment:id,name'
            ])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
