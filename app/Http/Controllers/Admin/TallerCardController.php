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
        ]);

        $tipo = CardType::firstOrCreate(['name' => $validated['type'] ?: 'Criatura']);

        $card = Card::create([
            'world_id' => World::query()->value('id'),
            'name' => $validated['name'],
            'effect' => $validated['effect'] ?: '—',
            'cost' => $validated['cost'] ?? 0,
            'flavor_text' => $validated['flavor_text'] ?? null,
            'card_type_id' => $tipo->id,
            'rarity_id' => Rarity::where('name', 'Común')->value('id') ?? Rarity::query()->value('id'),
            'alignment_id' => Alignment::query()->value('id'),
            'illustration' => Storage::disk('public')->putFile('cards', $request->file('image')),
            'taller_data' => $validated['data'] ?? null,
        ]);

        return response()->json([
            'id' => $card->id,
            'name' => $card->name,
            'url' => route('admin.cards.edit', $card),
        ], 201);
    }
}
