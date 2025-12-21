<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $locations = Location::query()
            ->with('world')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->input('location_type'), function ($query, $type) {
                $query->where('location_type', $type);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->where('world_id', $worldId);
            })
            ->latest()
            ->get(); // Cambiado de paginate(10) a get() para obtener todas las ubicaciones

        return Inertia::render('Admin/Locations/Index', [
            'locations' => $locations,
            'worlds' => World::all(['id', 'name']),
            'filters' => $request->only(['search', 'location_type', 'world_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Locations/Create', [
            'worlds' => World::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'in:castle,city,village,forest,mountain,dungeon,ruins,battlefield,port,temple,cave,tower'],
            'location_type' => ['required', 'in:ciudad,bosque,mazmorra,reino,montaña,mar,templo,ruina'],
            'coordinate_x' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'coordinate_y' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'image' => ['nullable', 'string'],
            'is_discovered' => ['boolean'],
        ]);

        Location::create($validated);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación creada exitosamente.');
    }

    public function edit(Location $location)
    {
        $location->load('world');

        return Inertia::render('Admin/Locations/Edit', [
            'location' => $location,
            'worlds' => World::all(['id', 'name']),
            'locations' => Location::with('world')->get(), // Todas las ubicaciones para el mapa
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'in:castle,city,village,forest,mountain,dungeon,ruins,battlefield,port,temple,cave,tower'],
            'location_type' => ['nullable', 'string', 'max:255'],
            'coordinate_x' => ['nullable', 'numeric', 'between:0,1536'],
            'coordinate_y' => ['nullable', 'numeric', 'between:0,754'],
            'image' => ['nullable', 'string'],
            'is_discovered' => ['boolean'],
        ]);

        $location->update($validated);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación actualizada exitosamente.');
    }

    public function destroy(Location $location)
    {
        $location->delete();

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación eliminada exitosamente.');
    }
}
