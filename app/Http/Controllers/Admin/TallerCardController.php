<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alignment;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\World;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Puente Taller -> Biblioteca. El taller manda su carta (JSON + PNG
 * renderizado) y aquí se convierte en una Card de la biblioteca:
 * la imagen renderizada hace de ilustración y el JSON íntegro se guarda en
 * taller_data para no perder los campos que la BD aún no modela (EGO...).
 * Los campos obligatorios de taxonomía que el taller no conoce se rellenan
 * con valores por defecto, editables después desde la ficha de la carta.
 */
class TallerCardController extends Controller
{
    /** El taller pide aquí la carta para reabrirla (?card=ID en el iframe). */
    public function show(Card $card)
    {
        abort_unless($card->taller_data, 404, 'Esta carta no nació en el Taller.');

        // La ilustración FUENTE (no el render) viaja aparte, con ruta
        // determinista por id, para que el taller la recupere al reabrir.
        $arte = "cards-art/{$card->id}.png";

        return response()->json([
            'id' => $card->id,
            'name' => $card->name,
            'data' => json_decode($card->taller_data, true),
            'art_url' => Storage::disk('public')->exists($arte) ? "/storage/{$arte}" : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'cost' => ['nullable', 'integer', 'min:0'],
            'effect' => ['nullable', 'string'],
            'flavor_text' => ['nullable', 'string'],
            'data' => ['nullable', 'json'],
            'image' => ['required', 'image', 'max:16384'],
            // Ilustración fuente (opcional): permite reabrir la carta en el
            // taller con su arte, no solo con el render final.
            'art' => ['nullable', 'image', 'max:16384'],
        ]);

        $tipo = CardType::firstOrCreate(['name' => $validated['type'] ?: 'Criatura']);

        // Upsert por nombre: reenviar la misma carta desde el taller la
        // ACTUALIZA (render nuevo incluido) en vez de duplicarla. El taller
        // es la única mesa de trabajo; la web solo la expone.
        $card = Card::whereNotNull('taller_data')->where('name', $validated['name'])->first();
        $nueva = $card === null;

        if ($card?->illustration) {
            Storage::disk('public')->delete($card->illustration);
        }

        $atributos = [
            'name' => $validated['name'],
            'effect' => $validated['effect'] ?: '—',
            'cost' => $validated['cost'] ?? 0,
            'flavor_text' => $validated['flavor_text'] ?? null,
            'card_type_id' => $tipo->id,
            'illustration' => Storage::disk('public')->putFile('cards', $request->file('image')),
            'taller_data' => $validated['data'] ?? null,
        ];

        if ($nueva) {
            $card = Card::create($atributos + [
                'world_id' => World::query()->value('id'),
                'rarity_id' => Rarity::where('name', 'Común')->value('id') ?? Rarity::query()->value('id'),
                'alignment_id' => Alignment::query()->value('id'),
            ]);
        } else {
            $card->update($atributos);
        }

        if ($request->hasFile('art')) {
            Storage::disk('public')->putFileAs('cards-art', $request->file('art'), "{$card->id}.png");
        }

        return response()->json([
            'id' => $card->id,
            'name' => $card->name,
            'updated' => ! $nueva,
            'url' => route('admin.cards.edit', $card),
        ], $nueva ? 201 : 200);
    }
}
