<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesUploadedImage;
use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    use ResolvesUploadedImage;

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
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Admin/Locations/Index', [
            // deepMerge: al pedir la pagina siguiente Inertia anade los
            // elementos a los que ya hay en pantalla en vez de sustituirlos.
            // Es lo que permite el scroll infinito sin recargar la vista.
            'locations' => Inertia::deepMerge($locations),
            'worlds' => World::all(['id', 'name', 'map_image']),
            'filters' => $request->only(['search', 'location_type', 'world_id']),
            'mapLocations' => $this->mapLocations(),
        ]);
    }

    /**
     * Pines para los mapas. Llevan world_id porque cada mundo tiene su propio
     * mapa y solo se pintan las ubicaciones del mundo que se está viendo.
     */
    private function mapLocations()
    {
        return Location::whereNotNull('coordinate_x')
            ->whereNotNull('coordinate_y')
            ->get(['id', 'name', 'description', 'location_type', 'coordinate_x', 'coordinate_y', 'world_id'])
            ->map(fn ($loc) => [
                'id' => $loc->id,
                'name' => $loc->name,
                'description' => $loc->description,
                'type' => $loc->location_type,
                'coordinate_x' => $loc->coordinate_x,
                'coordinate_y' => $loc->coordinate_y,
                'world_id' => $loc->world_id,
            ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Locations/Create', [
            'worlds' => World::all(['id', 'name', 'map_image']),
            'mapLocations' => $this->mapLocations(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_type' => ['required', 'in:castle,city,village,forest,mountain,dungeon,ruins,battlefield,port,temple,cave,tower,tavern'],
            'coordinate_x' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'coordinate_y' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_discovered' => ['boolean'],
        ]);

        if ($imagen = $this->resolveImage($request, null, 'locations')) {
            $validated['image'] = $imagen;
        } else {
            unset($validated['image']);
        }
        unset($validated['image_url']);

        Location::create($validated);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación creada exitosamente.');
    }

    public function show(Location $location)
    {
        $location->load(['world', 'characters']);

        return Inertia::render('Admin/Locations/Show', [
            'location' => $location,
        ]);
    }

    public function edit(Location $location)
    {
        $location->load('world');

        return Inertia::render('Admin/Locations/Edit', [
            'location' => $location,
            'worlds' => World::all(['id', 'name', 'map_image']),
            'mapLocations' => $this->mapLocations(),
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location_type' => ['required', 'in:castle,city,village,forest,mountain,dungeon,ruins,battlefield,port,temple,cave,tower,tavern'],
            'coordinate_x' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'coordinate_y' => ['nullable', 'numeric', 'between:-999999.99,999999.99'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_discovered' => ['boolean'],
        ]);

        if ($imagen = $this->resolveImage($request, $location->image, 'locations')) {
            $validated['image'] = $imagen;
        } else {
            unset($validated['image']);
        }
        unset($validated['image_url']);

        $location->update($validated);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación actualizada exitosamente.');
    }

    public function destroy(Location $location)
    {
        $this->deleteStoredImage($location->image);

        $location->delete();

        return redirect()->route('admin.locations.index')
            ->with('success', 'Ubicación eliminada exitosamente.');
    }
}
