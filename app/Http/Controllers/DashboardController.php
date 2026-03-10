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
        // ⚡ Bolt: Optimize dashboard stats calculation
        // 💡 What: Switched from PHP collection groupBy/count to database aggregation
        // 🎯 Why: Eager loading thousands of cards into memory just to count their rarities caused O(N) memory overhead.
        // 📊 Impact: Transforms an O(N) memory operation into an O(R) one (where R is the number of unique rarities).
        $cardsByRarity = Card::select('rarity_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('rarity_id')
            ->groupBy('rarity_id')
            ->with('rarity:id,name') // Only fetch needed columns
            ->get()
            ->mapWithKeys(function ($card) {
                // To safely access the shadowed rarity relationship on the Card model in PHP collections,
                // use $model->relationLoaded('rarity') && $model->getRelation('rarity') instead of $model->rarity
                $rarity = $card->relationLoaded('rarity') ? $card->getRelation('rarity') : null;
                $name = $rarity ? $rarity->name : 'Sin rareza';
                return [$name => $card->count];
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
