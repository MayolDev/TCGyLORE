<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Story;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoryController extends Controller
{
    public function index(Request $request)
    {
        $stories = Story::query()
            ->with('world')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->where('world_id', $worldId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Stories/Index', [
            'stories' => $stories,
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
            'world_id' => ['required', 'exists:worlds,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['required', 'in:leyenda,cuento,cronica,biografia,mito'],
            'era' => ['nullable', 'string', 'max:255'],
            'order' => ['integer'],
            'is_published' => ['boolean'],
        ]);

        Story::create($validated);

        return redirect()->route('admin.stories.index')
            ->with('success', 'Historia creada exitosamente.');
    }

    public function edit(Story $story)
    {
        $story->load('world');

        return Inertia::render('Admin/Stories/Edit', [
            'story' => $story,
            'worlds' => World::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Story $story)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['required', 'in:leyenda,cuento,cronica,biografia,mito'],
            'era' => ['nullable', 'string', 'max:255'],
            'order' => ['integer'],
            'is_published' => ['boolean'],
        ]);

        $story->update($validated);

        return redirect()->route('admin.stories.index')
            ->with('success', 'Historia actualizada exitosamente.');
    }

    public function destroy(Story $story)
    {
        $story->delete();

        return redirect()->route('admin.stories.index')
            ->with('success', 'Historia eliminada exitosamente.');
    }
}
