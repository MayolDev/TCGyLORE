<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeckController extends Controller
{
    public function index()
    {
        $decks = Deck::query()
            ->withCount('cards')
            ->with(['cards' => fn ($q) => $q->with('card:id,name,illustration')])
            ->latest()
            ->get()
            ->map(function ($deck) {
                $porZona = $deck->cards->groupBy('zone')->map(fn ($g) => $g->sum('quantity'));
                $protagonista = $deck->cards->firstWhere('zone', 'protagonista')?->card;

                return [
                    'id' => $deck->id,
                    'name' => $deck->name,
                    'description' => $deck->description,
                    'type' => $deck->type,
                    'protagonista' => $protagonista ? ['name' => $protagonista->name, 'image' => $protagonista->illustration_url] : null,
                    'totales' => [
                        'principal' => $porZona->get('principal', 0),
                        'side' => $porZona->get('side', 0),
                        'senda' => $porZona->get('senda', 0),
                        'eventos' => $porZona->get('eventos', 0),
                    ],
                    'updated_at' => $deck->updated_at?->toDateString(),
                ];
            });

        return Inertia::render('Admin/Decks/Index', [
            'decks' => $decks,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Decks/Builder', [
            'deck' => null,
            'library' => $this->library(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        $deck = Deck::create($validated['deck']);
        $this->syncCards($deck, $validated['cards']);

        return redirect()->route('admin.decks.edit', $deck)
            ->with('success', 'Mazo creado exitosamente.');
    }

    public function edit(Deck $deck)
    {
        $deck->load('cards');

        return Inertia::render('Admin/Decks/Builder', [
            'deck' => [
                'id' => $deck->id,
                'name' => $deck->name,
                'description' => $deck->description,
                'type' => $deck->type,
                'cards' => $deck->cards->map(fn ($dc) => [
                    'card_id' => $dc->card_id,
                    'zone' => $dc->zone,
                    'quantity' => $dc->quantity,
                ]),
            ],
            'library' => $this->library(),
        ]);
    }

    public function update(Request $request, Deck $deck)
    {
        $validated = $this->validated($request);

        $deck->update($validated['deck']);
        $this->syncCards($deck, $validated['cards']);

        return redirect()->route('admin.decks.edit', $deck)
            ->with('success', 'Mazo guardado.');
    }

    public function destroy(Deck $deck)
    {
        $deck->delete();

        return redirect()->route('admin.decks.index')
            ->with('success', 'Mazo eliminado.');
    }

    /** Toda la biblioteca, con lo que el constructor necesita para pintar y clasificar. */
    private function library(): array
    {
        return Card::query()
            ->with('cardType:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'illustration', 'effect', 'cost', 'card_type_id'])
            ->map(fn ($card) => [
                'id' => $card->id,
                'name' => $card->name,
                'image' => $card->illustration_url,
                'effect' => $card->effect,
                'cost' => $card->cost,
                'type' => $card->cardType?->name ?? 'Sin tipo',
            ])
            ->all();
    }

    /** @return array{deck: array, cards: array} */
    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:normal,eventos'],
            'cards' => ['array'],
            'cards.*.card_id' => ['required', 'exists:cards,id'],
            'cards.*.zone' => ['required', 'in:protagonista,senda,principal,side,eventos'],
            'cards.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $cards = collect($validated['cards'] ?? []);

        // Reglas de composición
        $protagonistas = $cards->where('zone', 'protagonista')->sum('quantity');
        if ($protagonistas > 1) {
            abort(422, 'Un mazo solo puede tener un Protagonista.');
        }
        if ($validated['type'] === 'eventos' && $cards->contains(fn ($c) => $c['zone'] !== 'eventos')) {
            abort(422, 'Un mazo de eventos solo puede contener cartas en la zona de eventos.');
        }

        return [
            'deck' => collect($validated)->only(['name', 'description', 'type'])->all(),
            'cards' => $cards->all(),
        ];
    }

    private function syncCards(Deck $deck, array $cards): void
    {
        $deck->cards()->delete();
        foreach ($cards as $entry) {
            $deck->cards()->create($entry);
        }
    }
}
