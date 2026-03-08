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
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $cardsByRarity = Card::select('rarity_id', DB::raw('count(*) as count'))
            ->whereNotNull('rarity_id')
            ->groupBy('rarity_id')
            ->with('rarity:id,name')
            ->get()
            ->mapWithKeys(function ($group) {
                // Using getRelation to safely access the relationship due to naming conflict
                // between the 'rarity' string column and the 'rarity()' relationship method.
                $rarity = $group->relationLoaded('rarity') ? $group->getRelation('rarity') : null;
                return [$rarity?->name ?? 'Sin rareza' => $group->count];
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
