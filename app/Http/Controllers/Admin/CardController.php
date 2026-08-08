<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\Card;
use App\Models\CardType;
use App\Models\Character;
use App\Models\Edition;
use App\Models\Faction;
use App\Models\Rarity;
use App\Models\World;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CardController extends Controller
{
    public function index(Request $request)
    {
        $cards = Card::query()
            ->with(['world', 'character', 'cardType', 'rarity', 'archetype', 'alignment', 'faction', 'edition', 'artist'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->input('rarity_id'), function ($query, $rarityId) {
                $query->where('rarity_id', $rarityId);
            })
            ->when($request->input('card_type_id'), function ($query, $typeId) {
                $query->where('card_type_id', $typeId);
            })
            ->when($request->input('alignment_id'), function ($query, $alignmentId) {
                $query->where('alignment_id', $alignmentId);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->where('world_id', $worldId);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Cards/Index', [
            'cards' => $cards,
            'worlds' => World::all(['id', 'name']),
            'filters' => $request->only(['search', 'rarity_id', 'card_type_id', 'alignment_id', 'world_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Cards/Create', [
            'worlds' => World::all(['id', 'name']),
            'characters' => Character::all(['id', 'name']),
            'cardTypes' => CardType::all(['id', 'name']),
            'rarities' => Rarity::all(['id', 'name']),
            'archetypes' => Archetype::all(['id', 'name']),
            'alignments' => Alignment::all(['id', 'name']),
            'factions' => Faction::all(['id', 'name']),
            'editions' => Edition::all(['id', 'name']),
            'artists' => Artist::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'character_id' => ['nullable', 'exists:characters,id'],
            'name' => ['required', 'string', 'max:255'],
            'illustration' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'effect' => ['required', 'string'],
            'strength' => ['nullable', 'integer', 'min:0', 'max:20'],
            'agility' => ['nullable', 'integer', 'min:0', 'max:20'],
            'charisma' => ['nullable', 'integer', 'min:0', 'max:20'],
            'mind' => ['nullable', 'integer', 'min:0', 'max:20'],
            'defense' => ['nullable', 'integer', 'min:0', 'max:20'],
            'magic_defense' => ['nullable', 'integer', 'min:0', 'max:20'],
            'health' => ['nullable', 'integer', 'min:1', 'max:100'],
            'cost' => ['required', 'integer', 'min:0'],
            'card_type_id' => ['required', 'exists:card_types,id'],
            'rarity_id' => ['required', 'exists:rarities,id'],
            'archetype_id' => ['nullable', 'exists:archetypes,id'],
            'alignment_id' => ['required', 'exists:alignments,id'],
            'faction_id' => ['nullable', 'exists:factions,id'],
            'edition_id' => ['nullable', 'exists:editions,id'],
            'artist_id' => ['nullable', 'exists:artists,id'],
            'flavor_text' => ['nullable', 'string'],
        ]);

        // Manejar upload de imagen
        if ($request->hasFile('illustration')) {
            $validated['illustration'] = $request->file('illustration')->store('cards', 'public');
        }

        Card::create($validated);

        return redirect()->route('admin.cards.index')
            ->with('success', 'Carta creada exitosamente.');
    }

    public function edit(Card $card)
    {
        $card->load(['world', 'character', 'cardType', 'rarity', 'archetype', 'alignment', 'faction', 'edition', 'artist']);

        return Inertia::render('Admin/Cards/Edit', [
            'card' => $card,
            'worlds' => World::all(['id', 'name']),
            'characters' => Character::all(['id', 'name']),
            'cardTypes' => CardType::all(['id', 'name']),
            'rarities' => Rarity::all(['id', 'name']),
            'archetypes' => Archetype::all(['id', 'name']),
            'alignments' => Alignment::all(['id', 'name']),
            'factions' => Faction::all(['id', 'name']),
            'editions' => Edition::all(['id', 'name']),
            'artists' => Artist::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Card $card)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'character_id' => ['nullable', 'exists:characters,id'],
            'name' => ['required', 'string', 'max:255'],
            'illustration' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'effect' => ['required', 'string'],
            'strength' => ['nullable', 'integer', 'min:0', 'max:20'],
            'agility' => ['nullable', 'integer', 'min:0', 'max:20'],
            'charisma' => ['nullable', 'integer', 'min:0', 'max:20'],
            'mind' => ['nullable', 'integer', 'min:0', 'max:20'],
            'defense' => ['nullable', 'integer', 'min:0', 'max:20'],
            'magic_defense' => ['nullable', 'integer', 'min:0', 'max:20'],
            'health' => ['nullable', 'integer', 'min:1', 'max:100'],
            'cost' => ['required', 'integer', 'min:0'],
            'card_type_id' => ['required', 'exists:card_types,id'],
            'rarity_id' => ['required', 'exists:rarities,id'],
            'archetype_id' => ['nullable', 'exists:archetypes,id'],
            'alignment_id' => ['required', 'exists:alignments,id'],
            'faction_id' => ['nullable', 'exists:factions,id'],
            'edition_id' => ['nullable', 'exists:editions,id'],
            'artist_id' => ['nullable', 'exists:artists,id'],
            'flavor_text' => ['nullable', 'string'],
        ]);

        // Manejar upload de imagen
        if ($request->hasFile('illustration')) {
            // Eliminar imagen anterior si existe
            if ($card->illustration) {
                Storage::disk('public')->delete($card->illustration);
            }
            $validated['illustration'] = $request->file('illustration')->store('cards', 'public');
        }

        $card->update($validated);

        return redirect()->route('admin.cards.index')
            ->with('success', 'Carta actualizada exitosamente.');
    }

    public function destroy(Card $card)
    {
        // Eliminar imagen si existe
        if ($card->illustration) {
            Storage::disk('public')->delete($card->illustration);
        }

        $card->delete();

        return redirect()->route('admin.cards.index')
            ->with('success', 'Carta eliminada exitosamente.');
    }
}
