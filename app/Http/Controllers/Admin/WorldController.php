<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorldController extends Controller
{
    public function index(Request $request)
    {
        $worlds = World::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->withCount(['stories', 'characters', 'locations', 'cards'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Worlds/Index', [
            'worlds' => $worlds,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Worlds/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'banner_image' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        World::create($validated);

        return redirect()->route('admin.worlds.index')
            ->with('success', 'Mundo creado exitosamente.');
    }

    public function edit(World $world)
    {
        return Inertia::render('Admin/Worlds/Edit', [
            'world' => $world,
        ]);
    }

    public function update(Request $request, World $world)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'banner_image' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $world->update($validated);

        return redirect()->route('admin.worlds.index')
            ->with('success', 'Mundo actualizado exitosamente.');
    }

    public function destroy(World $world)
    {
        $world->delete();

        return redirect()->route('admin.worlds.index')
            ->with('success', 'Mundo eliminado exitosamente.');
    }
}
