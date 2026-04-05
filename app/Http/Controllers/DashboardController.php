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
        // Optimization: Push grouping to the database instead of loading all models into memory.
        // We use mapWithKeys and getRelation() to bypass the 'rarity' attribute/relation naming conflict.
        $cardsByRarity = Card::select('rarity_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('rarity_id')
            ->groupBy('rarity_id')
            ->with('rarity:id,name')
            ->get()
            ->mapWithKeys(function ($item) {
                $rarity = ($item->relationLoaded('rarity') && $item->getRelation('rarity')) ? $item->getRelation('rarity') : null;
                return [$rarity ? $rarity->name : 'Sin rareza' => $item->count];
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
