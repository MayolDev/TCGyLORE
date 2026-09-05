<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesUploadedImage;
use App\Http\Controllers\Controller;
use App\Models\Story;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoryController extends Controller
{
    use ResolvesUploadedImage;

    public function index(Request $request)
    {
        $stories = Story::query()
            ->with('worlds')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->whereHas('worlds', fn ($q) => $q->where('worlds.id', $worldId));
            })
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Admin/Stories/Index', [
            // deepMerge: al pedir la pagina siguiente Inertia anade los
            // elementos a los que ya hay en pantalla en vez de sustituirlos.
            // Es lo que permite el scroll infinito sin recargar la vista.
            'stories' => Inertia::deepMerge($stories),
            'worlds' => World::all(['id', 'name']),
            'filters' => $request->only(['search', 'category', 'world_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Stories/Create', [
            'worlds' => World::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_ids' => ['required', 'array', 'min:1'],
            'world_ids.*' => ['exists:worlds,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['required', 'in:leyenda,cuento,cronica,biografia,mito'],
            'era' => ['nullable', 'string', 'max:255'],
            'order' => ['integer'],
            'is_published' => ['boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        if ($portada = $this->resolveImage($request, null, 'stories')) {
            $validated['cover_image'] = $portada;
        }
        unset($validated['image'], $validated['image_url'], $validated['world_ids']);

        $story = Story::create($validated);
        $story->worlds()->sync($request->input('world_ids'));

        return redirect()->route('admin.stories.index')
            ->with('success', 'Historia creada exitosamente.');
    }

    public function show(Story $story)
    {
        $story->load(['worlds', 'characters']);

        return Inertia::render('Admin/Stories/Show', [
            'story' => $story,
        ]);
    }

    public function edit(Story $story)
    {
        $story->load('worlds');

        return Inertia::render('Admin/Stories/Edit', [
            'story' => $story,
            'worlds' => World::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Story $story)
    {
        $validated = $request->validate([
            'world_ids' => ['required', 'array', 'min:1'],
            'world_ids.*' => ['exists:worlds,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['required', 'in:leyenda,cuento,cronica,biografia,mito'],
            'era' => ['nullable', 'string', 'max:255'],
            'order' => ['integer'],
            'is_published' => ['boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        if ($portada = $this->resolveImage($request, $story->cover_image, 'stories')) {
            $validated['cover_image'] = $portada;
        }
        unset($validated['image'], $validated['image_url'], $validated['world_ids']);

        $story->update($validated);
        $story->worlds()->sync($request->input('world_ids'));

        return redirect()->route('admin.stories.index')
            ->with('success', 'Historia actualizada exitosamente.');
    }

    public function destroy(Story $story)
    {
        $this->deleteStoredImage($story->cover_image);
        $story->delete();

        return redirect()->route('admin.stories.index')
            ->with('success', 'Historia eliminada exitosamente.');
    }
}
