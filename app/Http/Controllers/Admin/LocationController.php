<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\World;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Get all locations for the map view with optimized query.
     * Uses toBase() to skip model hydration for better performance.
     */
    private function getAllLocationsForMap()
    {
        return Location::query()
            ->select('id', 'name', 'description', 'location_type as type', 'coordinate_x', 'coordinate_y')
            ->whereNotNull('coordinate_x')
            ->whereNotNull('coordinate_y')
            ->toBase()
            ->get();
    }

    public function index(Request $request)
    {
        $locations = Location::query()
            ->with('world:id,name') // Optimize: only load necessary columns
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
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Locations/Index', [
            'locations' => $locations,
            'worlds' => World::all(['id', 'name']),
            'filters' => $request->only(['search', 'location_type', 'world_id']),
            'allLocations' => $this->getAllLocationsForMap(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Locations/Create', [
            'worlds' => World::all(['id', 'name']),
            'allLocations' => $this->getAllLocationsForMap(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_type' => ['required', 'in:castle,city,village,forest,mountain,dungeon,ruins,battlefield,port,temple,cave,tower'],
            'coordinate_x' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'coordinate_y' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_discovered' => ['boolean'],
        ]);

        // Manejar la carga de imagen
        if ($request->hasFile('image')) {
            $validated['image'] = Storage::putFile('locations', $request->file('image'), 'public');
        }

        Location::create($validated);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación creada exitosamente.');
    }

    public function edit(Location $location)
    {
        // Removed eager loading of world as it's not used in the edit form view directly (only world_id)

        return Inertia::render('Admin/Locations/Edit', [
            'location' => $location,
            'worlds' => World::all(['id', 'name']),
            'allLocations' => $this->getAllLocationsForMap(),
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_type' => ['required', 'in:castle,city,village,forest,mountain,dungeon,ruins,battlefield,port,temple,cave,tower'],
            'coordinate_x' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'coordinate_y' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_discovered' => ['boolean'],
        ]);

        // Manejar la carga de imagen
        if ($request->hasFile('image')) {
            // Eliminar la imagen anterior si existe
            if ($location->image) {
                Storage::delete($location->image);
            }
            $validated['image'] = Storage::putFile('locations', $request->file('image'), 'public');
        }

        $location->update($validated);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación actualizada exitosamente.');
    }

    public function destroy(Location $location)
    {
        // Eliminar la imagen si existe
        if ($location->image) {
            Storage::delete($location->image);
        }

        $location->delete();

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación eliminada exitosamente.');
    }
}
