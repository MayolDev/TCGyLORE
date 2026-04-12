<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ManualSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManualSectionController extends Controller
{
    public function index(Request $request)
    {
        $sections = ManualSection::query()
            ->with('parent')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->orderBy('category')
            ->orderBy('order')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Manual/Index', [
            'sections' => $sections,
            'filters' => $request->only(['search', 'category']),
            'categories' => $this->getCategories(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Manual/Create', [
            'categories' => $this->getCategories(),
            'sections' => ManualSection::whereNull('parent_id')
                ->orderBy('category')
                ->orderBy('order')
                ->get(['id', 'title', 'category']),
            'nextOrders' => $this->getNextOrders(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:fundamentos,mecanicas,cartas,lore,glosario,desarrollo'],
            'content' => ['required', 'string'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'parent_id' => ['nullable', 'exists:manual_sections,id'],
        ]);

        // Si no se proporciona orden, calcular el siguiente disponible para esa categoría
        if (!isset($validated['order']) || $validated['order'] === null) {
            $maxOrder = ManualSection::where('category', $validated['category'])->max('order');
            $validated['order'] = ($maxOrder ?? -1) + 1;
        }

        ManualSection::create($validated);

        return redirect()->route('admin.manual-sections.index')
            ->with('success', 'Sección del manual creada exitosamente.');
    }

    public function edit(ManualSection $manualSection)
    {
        $manualSection->load('parent');

        return Inertia::render('Admin/Manual/Edit', [
            'section' => $manualSection,
            'categories' => $this->getCategories(),
            'sections' => ManualSection::where('id', '!=', $manualSection->id)
                ->whereNull('parent_id')
                ->orderBy('category')
                ->orderBy('order')
                ->get(['id', 'title', 'category']),
        ]);
    }

    public function update(Request $request, ManualSection $manualSection)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:fundamentos,mecanicas,cartas,lore,glosario,desarrollo'],
            'content' => ['required', 'string'],
            'order' => ['integer', 'min:0'],
            'is_published' => ['boolean'],
            'parent_id' => ['nullable', 'exists:manual_sections,id'],
        ]);

        $manualSection->update($validated);

        return redirect()->route('admin.manual-sections.index')
            ->with('success', 'Sección del manual actualizada exitosamente.');
    }

    public function destroy(ManualSection $manualSection)
    {
        $manualSection->delete();

        return redirect()->route('admin.manual-sections.index')
            ->with('success', 'Sección del manual eliminada exitosamente.');
    }

    private function getNextOrders(): array
    {
        $orders = [];
        foreach (array_keys($this->getCategories()) as $category) {
            $maxOrder = ManualSection::where('category', $category)->max('order');
            $orders[$category] = ($maxOrder ?? -1) + 1;
        }
        return $orders;
    }

    private function getCategories(): array
    {
        return [
            'fundamentos' => 'Fundamentos',
            'mecanicas' => 'Mecánicas de Juego',
            'cartas' => 'Cartas',
            'lore' => 'Lore y Mundo',
            'glosario' => 'Glosario',
            'desarrollo' => 'Desarrollo',
        ];
    }
}
