<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesUploadedImage;
use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\CharacterRelation;
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

    /**
     * El elenco entero como grafo. Los nodos son personajes y las aristas
     * relaciones; una fila de relacion es UNA arista, aunque se lea distinto
     * desde cada lado.
     *
     * Se van los personajes sueltos: sin ninguna relacion no aportan nada al
     * dibujo y solo lo llenan de puntos flotando.
     */
    public function graph()
    {
        $relaciones = CharacterRelation::query()
            ->get(['id', 'character_id', 'related_character_id', 'type', 'inverse_type', 'notes']);

        $conRelacion = $relaciones->pluck('character_id')
            ->merge($relaciones->pluck('related_character_id'))
            ->unique();

        $personajes = Character::whereIn('id', $conRelacion)
            ->with('worlds:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'image', 'faction', 'alignment']);

        return Inertia::render('Admin/Characters/Graph', [
            'nodos' => $personajes->map(fn (Character $c) => [
                'id' => $c->id,
                'nombre' => $c->name,
                'imagen' => $c->image_url,
                'faccion' => $c->faction,
                // Grado: cuantas relaciones tiene. Manda en el tamano del nodo.
                'grado' => $relaciones->where('character_id', $c->id)->count()
                    + $relaciones->where('related_character_id', $c->id)->count(),
            ])->values(),
            'aristas' => $relaciones->map(fn (CharacterRelation $r) => [
                'id' => $r->id,
                'origen' => $r->character_id,
                'destino' => $r->related_character_id,
                'tipo' => $r->type,
                'inverso' => $r->inverse_type,
                'notas' => $r->notes,
            ])->values(),
            'sueltos' => Character::whereNotIn('id', $conRelacion)->count(),
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
            'outgoingRelations.relatedCharacter:id,name,title,image',
            'incomingRelations.character:id,name,title,image',
        ]);

        return Inertia::render('Admin/Characters/Show', [
            'character' => $character,
            'relaciones' => $this->relacionesParaVista($character),
        ]);
    }

    public function edit(Character $character)
    {
        $character->load([
            'worlds',
            'locations',
            'stories',
            'outgoingRelations.relatedCharacter:id,name,title,image',
            'incomingRelations.character:id,name,title,image',
        ]);

        return Inertia::render('Admin/Characters/Edit', [
            'character' => $character,
            'worlds' => World::all(['id', 'name']),
            'locations' => Location::all(['id', 'name']),
            'stories' => Story::all(['id', 'title']),
            'relaciones' => $this->relacionesParaVista($character),
            // Para el desplegable de "vincular con": todos menos el mismo.
            'personajes' => Character::where('id', '!=', $character->id)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Las relaciones ya volteadas y listas para pintar. Se marca con `propia`
     * si la fila nacio en este personaje, porque el texto que se guardo es el
     * de ese lado y al editarla hay que saberlo.
     */
    private function relacionesParaVista(Character $character): array
    {
        return $character->relacionesVistas()
            ->map(fn (array $r) => [
                'id' => $r['id'],
                'tipo' => $r['tipo'],
                'notas' => $r['notas'],
                'personaje' => [
                    'id' => $r['personaje']->id,
                    'name' => $r['personaje']->name,
                    'title' => $r['personaje']->title,
                    'image_url' => $r['personaje']->image_url,
                ],
            ])
            ->all();
    }

    public function storeRelation(Request $request, Character $character)
    {
        $validated = $request->validate([
            'related_character_id' => ['required', 'exists:characters,id'],
            'type' => ['required', 'string', 'max:120'],
            'inverse_type' => ['nullable', 'string', 'max:120'],
            'notes' => ['nullable', 'string'],
        ]);

        if ((int) $validated['related_character_id'] === $character->id) {
            return back()->withErrors(['related_character_id' => 'Un personaje no se relaciona consigo mismo.']);
        }

        // La pareja es unica sin importar el orden: si ya existe al reves, se
        // actualiza esa fila en vez de crear una que la contradiga.
        $existente = CharacterRelation::where(function ($q) use ($character, $validated) {
            $q->where('character_id', $character->id)
                ->where('related_character_id', $validated['related_character_id']);
        })->orWhere(function ($q) use ($character, $validated) {
            $q->where('character_id', $validated['related_character_id'])
                ->where('related_character_id', $character->id);
        })->first();

        if ($existente) {
            $alReves = $existente->character_id !== $character->id;

            $existente->update($alReves
                ? ['inverse_type' => $validated['type'], 'type' => $validated['inverse_type'] ?: $existente->type, 'notes' => $validated['notes'] ?? $existente->notes]
                : ['type' => $validated['type'], 'inverse_type' => $validated['inverse_type'] ?? null, 'notes' => $validated['notes'] ?? null]);

            return back()->with('success', 'Relacion actualizada.');
        }

        CharacterRelation::create([
            'character_id' => $character->id,
            'related_character_id' => $validated['related_character_id'],
            'type' => $validated['type'],
            'inverse_type' => $validated['inverse_type'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Relacion creada.');
    }

    public function destroyRelation(CharacterRelation $relation)
    {
        $relation->delete();

        return back()->with('success', 'Relacion eliminada.');
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
