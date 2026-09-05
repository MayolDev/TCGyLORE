<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesUploadedImage;
use App\Http\Controllers\Controller;
use App\Models\World;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WorldController extends Controller
{
    use ResolvesUploadedImage;

    public function index(Request $request)
    {
        $worlds = World::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->withCount(['stories', 'characters', 'locations', 'cards'])
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Admin/Worlds/Index', [
            // deepMerge: al pedir la pagina siguiente Inertia anade los
            // elementos a los que ya hay en pantalla en vez de sustituirlos.
            // Es lo que permite el scroll infinito sin recargar la vista.
            'worlds' => Inertia::deepMerge($worlds),
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
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'map_image' => ['nullable', 'image', 'max:20480'],
            'is_active' => ['boolean'],
        ]);

        if ($banner = $this->resolveImage($request, null, 'worlds')) {
            $validated['banner_image'] = $banner;
        }
        unset($validated['image'], $validated['image_url']);

        if ($request->hasFile('map_image')) {
            $validated['map_image'] = Storage::disk('public')->putFile('worlds', $request->file('map_image'));
        } else {
            unset($validated['map_image']);
        }

        World::create($validated);

        return redirect()->route('admin.worlds.index')
            ->with('success', 'Mundo creado exitosamente.');
    }

    public function show(World $world)
    {
        $world->loadCount(['stories', 'characters', 'locations', 'cards']);

        return Inertia::render('Admin/Worlds/Show', [
            'world' => $world,
        ]);
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
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'map_image' => ['nullable', 'image', 'max:20480'],
            'is_active' => ['boolean'],
        ]);

        if ($banner = $this->resolveImage($request, $world->banner_image, 'worlds')) {
            $validated['banner_image'] = $banner;
        }
        unset($validated['image'], $validated['image_url']);

        // Solo tocar el mapa si llega fichero nuevo; si no, conservar el actual.
        if ($request->hasFile('map_image')) {
            if ($world->map_image) {
                Storage::disk('public')->delete($world->map_image);
            }
            $validated['map_image'] = Storage::disk('public')->putFile('worlds', $request->file('map_image'));
        } else {
            unset($validated['map_image']);
        }

        $world->update($validated);

        return redirect()->route('admin.worlds.index')
            ->with('success', 'Mundo actualizado exitosamente.');
    }

    public function destroy(World $world)
    {
        if ($world->map_image) {
            Storage::disk('public')->delete($world->map_image);
        }
        $this->deleteStoredImage($world->banner_image);

        $world->delete();

        return redirect()->route('admin.worlds.index')
            ->with('success', 'Mundo eliminado exitosamente.');
    }
}
