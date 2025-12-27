<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlignmentController extends Controller
{
    public function index()
    {
        $alignments = Alignment::latest()->paginate(15);

        return Inertia::render('Admin/Alignments/Index', [
            'alignments' => $alignments,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Alignments/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:alignments,name'],
            'description' => ['nullable', 'string'],
        ]);

        Alignment::create($validated);

        return redirect()->route('admin.alignments.index')
            ->with('success', 'Alineación creada exitosamente.');
    }

    public function edit(Alignment $alignment)
    {
        return Inertia::render('Admin/Alignments/Edit', [
            'alignment' => $alignment,
        ]);
    }

    public function update(Request $request, Alignment $alignment)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:alignments,name,'.$alignment->id],
            'description' => ['nullable', 'string'],
        ]);

        $alignment->update($validated);

        return redirect()->route('admin.alignments.index')
            ->with('success', 'Alineación actualizada exitosamente.');
    }

    public function destroy(Alignment $alignment)
    {
        $alignment->delete();

        return redirect()->route('admin.alignments.index')
            ->with('success', 'Alineación eliminada exitosamente.');
    }
}
