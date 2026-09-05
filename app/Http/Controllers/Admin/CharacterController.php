<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesUploadedImage;
use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\Location;
use App\Models\Story;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CharacterController extends Controller
{
    use ResolvesUploadedImage;

    public function index(Request $request)
    {
        $characters = Character::query()
            ->with('worlds')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            })
            ->when($request->input('alignment'), function ($query, $alignment) {
                $query->where('alignment', $alignment);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->whereHas('worlds', fn ($q) => $q->where('worlds.id', $worldId));
            })
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Admin/Characters/Index', [
            // deepMerge: al pedir la pagina siguiente, Inertia añade los
            // personajes a los que ya hay en pantalla en vez de sustituirlos.
            // Es lo que permite el scroll infinito sin recargar la vista.
            'characters' => Inertia::deepMerge($characters),
            'worlds' => World::all(['id', 'name']),
            'filters' => $request->only(['search', 'alignment', 'world_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Characters/Create', [
            'worlds' => World::all(['id', 'name']),
            'locations' => Location::all(['id', 'name']),
            'stories' => Story::all(['id', 'title']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_ids' => ['required', 'array', 'min:1'],
            'world_ids.*' => ['exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'biography' => ['nullable', 'string'],
            'spells' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'location_ids' => ['nullable', 'array'],
            'location_ids.*' => ['exists:locations,id'],
            'story_ids' => ['nullable', 'array'],
            'story_ids.*' => ['exists:stories,id'],
        ]);

        if ($retrato = $this->resolveImage($request, null, 'characters')) {
            $validated['image'] = $retrato;
        } else {
            unset($validated['image']);
        }
        unset($validated['image_url'], $validated['world_ids']);

        $character = Character::create($validated);
        $character->worlds()->sync($request->input('world_ids'));

        if ($request->has('location_ids')) {
            $character->locations()->sync($request->location_ids);
        }

        if ($request->has('story_ids')) {
            $character->stories()->sync($request->story_ids);
        }

        return redirect()->route('admin.characters.index')
            ->with('success', 'Personaje creado exitosamente.');
    }

    public function show(Character $character)
    {
        $character->load([
            'worlds',
            'locations',
            'stories',
            // Sus cartas de la Biblioteca. Las del Taller se pintan enteras,
            // asi que hace falta la ilustracion y el taller_data (de ahi sale
            // el foil); el resto cae al mosaico con tipo y rareza.
            'cards' => fn ($q) => $q->with(['cardType:id,name', 'rarity:id,name'])->orderBy('name'),
        ]);

        return Inertia::render('Admin/Characters/Show', [
            'character' => $character,
        ]);
    }

    public function edit(Character $character)
    {
        $character->load(['worlds', 'locations', 'stories']);

        return Inertia::render('Admin/Characters/Edit', [
            'character' => $character,
            'worlds' => World::all(['id', 'name']),
            'locations' => Location::all(['id', 'name']),
            'stories' => Story::all(['id', 'title']),
        ]);
    }

    public function update(Request $request, Character $character)
    {
        $validated = $request->validate([
            'world_ids' => ['required', 'array', 'min:1'],
            'world_ids.*' => ['exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'biography' => ['nullable', 'string'],
            'spells' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'location_ids' => ['nullable', 'array'],
            'location_ids.*' => ['exists:locations,id'],
            'story_ids' => ['nullable', 'array'],
            'story_ids.*' => ['exists:stories,id'],
        ]);

        if ($retrato = $this->resolveImage($request, $character->image, 'characters')) {
            $validated['image'] = $retrato;
        } else {
            unset($validated['image']);
        }
        unset($validated['image_url'], $validated['world_ids']);

        $character->update($validated);
        $character->worlds()->sync($request->input('world_ids'));

        if ($request->has('location_ids')) {
            $character->locations()->sync($request->location_ids);
        } else {
            $character->locations()->detach();
        }

        if ($request->has('story_ids')) {
            $character->stories()->sync($request->story_ids);
        } else {
            $character->stories()->detach();
        }

        return redirect()->route('admin.characters.index')
            ->with('success', 'Personaje actualizado exitosamente.');
    }

    public function destroy(Character $character)
    {
        $this->deleteStoredImage($character->image);
        $character->delete();

        return redirect()->route('admin.characters.index')
            ->with('success', 'Personaje eliminado exitosamente.');
    }
}
