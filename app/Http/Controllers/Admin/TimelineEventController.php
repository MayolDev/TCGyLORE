<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\Location;
use App\Models\TimelineEvent;
use App\Models\World;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimelineEventController extends Controller
{
    public function index(Request $request)
    {
        $events = TimelineEvent::query()
            ->with(['world', 'characters', 'locations'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->input('event_type'), function ($query, $type) {
                $query->where('event_type', $type);
            })
            ->when($request->input('world_id'), function ($query, $worldId) {
                $query->where('world_id', $worldId);
            })
            ->orderBy('year')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/TimelineEvents/Index', [
            'events' => $events,
            'worlds' => World::all(['id', 'name']),
            'filters' => $request->only(['search', 'event_type', 'world_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/TimelineEvents/Create', [
            'worlds' => World::all(['id', 'name']),
            'characters' => Character::all(['id', 'name']),
            'locations' => Location::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'year' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'event_type' => ['required', 'in:guerra,fundacion,catastrofe,paz,descubrimiento,traicion,alianza'],
            'importance' => ['required', 'in:menor,importante,crucial'],
            'character_ids' => ['nullable', 'array'],
            'character_ids.*' => ['exists:characters,id'],
            'location_ids' => ['nullable', 'array'],
            'location_ids.*' => ['exists:locations,id'],
        ]);

        $event = TimelineEvent::create($validated);

        if ($request->has('character_ids')) {
            $event->characters()->sync($request->character_ids);
        }

        if ($request->has('location_ids')) {
            $event->locations()->sync($request->location_ids);
        }

        return redirect()->route('admin.timeline-events.index')
            ->with('success', 'Evento creado exitosamente.');
    }

    public function edit(TimelineEvent $timelineEvent)
    {
        $timelineEvent->load(['world', 'characters', 'locations']);

        return Inertia::render('Admin/TimelineEvents/Edit', [
            'event' => $timelineEvent,
            'worlds' => World::all(['id', 'name']),
            'characters' => Character::all(['id', 'name']),
            'locations' => Location::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, TimelineEvent $timelineEvent)
    {
        $validated = $request->validate([
            'world_id' => ['required', 'exists:worlds,id'],
            'year' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'event_type' => ['required', 'in:guerra,fundacion,catastrofe,paz,descubrimiento,traicion,alianza'],
            'importance' => ['required', 'in:menor,importante,crucial'],
            'character_ids' => ['nullable', 'array'],
            'character_ids.*' => ['exists:characters,id'],
            'location_ids' => ['nullable', 'array'],
            'location_ids.*' => ['exists:locations,id'],
        ]);

        $timelineEvent->update($validated);

        if ($request->has('character_ids')) {
            $timelineEvent->characters()->sync($request->character_ids);
        }

        if ($request->has('location_ids')) {
            $timelineEvent->locations()->sync($request->location_ids);
        }

        return redirect()->route('admin.timeline-events.index')
            ->with('success', 'Evento actualizado exitosamente.');
    }

    public function destroy(TimelineEvent $timelineEvent)
    {
        $timelineEvent->delete();

        return redirect()->route('admin.timeline-events.index')
            ->with('success', 'Evento eliminado exitosamente.');
    }
}
