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
        // ⚡ Bolt: Transforms O(N) memory operation into O(R) by moving counting logic to DB layer.
        $cardsByRarity = Card::select('rarity_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('rarity_id')
            ->with('rarity')
            ->get()
            ->mapWithKeys(function ($item) {
                // ⚡ Bolt: Safely bypassing the string attribute shadowing conflict on the Card model
                $rarity = $item->relationLoaded('rarity') && $item->getRelation('rarity')
                    ? $item->getRelation('rarity')->name
                    : 'Sin rareza';
                return [$rarity => $item->count];
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
            // ⚡ Bolt: Selecting only required relationship columns reduces model hydration overhead and payload size.
            'recent_cards' => Card::with(['world:id,name', 'character:id,name', 'rarity:id,name', 'cardType:id,name', 'alignment:id,name'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
