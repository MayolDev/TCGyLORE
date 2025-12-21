<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\Location;
use App\Models\Story;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CharacterController extends Controller
{
    public function index(Request $request)
    {
        $characters = Character::query()
            ->with('world')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            })
            ->when($request->input('alignment'), function ($query, $alignment) {
                $query->where('alignment', $alignment);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->where('world_id', $worldId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Characters/Index', [
            'characters' => $characters,
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
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'biography' => ['nullable', 'string'],
            'spells' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
            'location_ids' => ['nullable', 'array'],
            'location_ids.*' => ['exists:locations,id'],
            'story_ids' => ['nullable', 'array'],
            'story_ids.*' => ['exists:stories,id'],
        ]);

        $character = Character::create($validated);

        if ($request->has('location_ids')) {
            $character->locations()->sync($request->location_ids);
        }

        if ($request->has('story_ids')) {
            $character->stories()->sync($request->story_ids);
        }

        return redirect()->route('admin.characters.index')
            ->with('success', 'Personaje creado exitosamente.');
    }

    public function edit(Character $character)
    {
        $character->load(['world', 'locations', 'stories']);

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
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'biography' => ['nullable', 'string'],
            'spells' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
            'location_ids' => ['nullable', 'array'],
            'location_ids.*' => ['exists:locations,id'],
            'story_ids' => ['nullable', 'array'],
            'story_ids.*' => ['exists:stories,id'],
        ]);

        $character->update($validated);

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
        $character->delete();

        return redirect()->route('admin.characters.index')
            ->with('success', 'Personaje eliminado exitosamente.');
    }
}
