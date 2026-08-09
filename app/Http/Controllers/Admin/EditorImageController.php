<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Recibe las imágenes que se insertan desde el editor WYSIWYG
 * (botón, pegar o arrastrar) y devuelve la URL pública para el Markdown.
 */
class EditorImageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        $path = Storage::putFile('editor-images', $request->file('image'), 'public');

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
