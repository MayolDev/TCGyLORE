<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use App\Support\HojaTTS;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

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
                        'pacto' => $porZona->get('pacto', 0),
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

    /**
     * Descarga el mazo listo para Tabletop Simulator: un ZIP con las hojas de
     * rejilla y un LEEME con las dimensiones que hay que teclear en TTS.
     *
     * Las copias van expandidas (3 Goblins = 3 celdas), que es lo que TTS
     * espera: cada celda de la imagen es una carta fisica.
     */
    public function tts(Deck $deck)
    {
        // Redimensionar setenta PNG de 1792x2400 en una sola hoja pide sitio.
        ini_set('memory_limit', '1G');
        set_time_limit(300);

        $deck->load('cards.card');
        $cartas = HojaTTS::expandir($deck);

        if (empty($cartas)) {
            return back()->with('error', 'El mazo no tiene cartas que exportar.');
        }

        $slug = Str::slug($deck->name) ?: "mazo-{$deck->id}";
        $hojas = array_chunk($cartas, HojaTTS::POR_HOJA);

        $zipPath = tempnam(sys_get_temp_dir(), 'tts').'.zip';
        $zip = new ZipArchive;
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        $leeme = "MAZO: {$deck->name}\n";
        $leeme .= 'Cartas: '.count($cartas).' · Hojas: '.count($hojas)."\n\n";
        $leeme .= "COMO IMPORTARLO EN TABLETOP SIMULATOR\n";
        $leeme .= "=====================================\n";
        $leeme .= "1. Sube cada hoja-*.png a un sitio con enlace directo (Imgur, Steam Cloud...).\n";
        $leeme .= "2. En TTS: Objects > Components > Cards > Custom Deck.\n";
        $leeme .= "3. Pega la URL en 'Face', y la del dorso en 'Back'.\n";
        $leeme .= "4. Teclea Width y Height EXACTAMENTE como dice cada hoja aqui abajo.\n";
        $leeme .= "5. Si hay varias hojas, importa cada una y junta los mazos en la mesa.\n\n";

        foreach ($hojas as $i => $lote) {
            $hoja = HojaTTS::pintar($lote);
            $nombre = count($hojas) > 1
                ? sprintf('hoja-%d-de-%d.png', $i + 1, count($hojas))
                : 'hoja.png';

            $zip->addFromString($nombre, $hoja['png']);

            $leeme .= sprintf(
                "%s  ->  Width (columnas) = %d   Height (filas) = %d   (%d cartas)\n",
                $nombre, $hoja['columnas'], $hoja['filas'], $hoja['cartas']
            );

            unset($hoja);
        }

        $vacias = (count($hojas) * HojaTTS::POR_HOJA) - count($cartas);
        if ($vacias > 0) {
            $leeme .= "\nLa ultima hoja puede llevar celdas negras de relleno: en TTS se borran\n";
            $leeme .= "esas cartas a mano tras importar.\n";
        }

        $zip->addFromString('LEEME.txt', $leeme);
        $zip->close();

        return response()->download($zipPath, "tts-{$slug}.zip")->deleteFileAfterSend();
    }

    /** Toda la biblioteca, con lo que el constructor necesita para pintar y clasificar. */
    private function library(): array
    {
        return Card::query()
            ->with(['cardType:id,name', 'rarity:id,name'])
            ->orderBy('name')
            ->get(['id', 'name', 'illustration', 'effect', 'cost', 'card_type_id', 'rarity_id', 'taller_data'])
            ->map(fn ($card) => [
                'id' => $card->id,
                'name' => $card->name,
                // Miniatura: el constructor pinta decenas de cartas a la vez y
                // los originales son PNG de varios MB.
                'image' => $card->illustration_thumb_url,
                'effect' => $card->effect,
                'cost' => $card->cost,
                'type' => $card->cardType?->name ?? 'Sin tipo',
                'rarity' => $card->rarity?->name,
                'foil' => $card->is_foil,
            ])
            ->all();
    }

    /** @return array{deck: array, cards: array} */
    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:normal,eventos,social'],
            'cards' => ['array'],
            'cards.*.card_id' => ['required', 'exists:cards,id'],
            'cards.*.zone' => ['required', 'in:protagonista,senda,principal,side,eventos,pacto'],
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
        if ($validated['type'] === 'social' && $cards->contains(fn ($c) => $c['zone'] !== 'pacto')) {
            abort(422, 'Un mazo social solo puede contener Pactos.');
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
