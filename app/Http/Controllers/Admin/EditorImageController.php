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

        // Disco "public" explícito: el disco por defecto es privado y nginx
        // solo sirve storage/app/public.
        $path = Storage::disk('public')->putFile('editor-images', $request->file('image'));

        // Ruta relativa: la URL absoluta arrastra APP_URL, que en local no
        // coincide con el host del navegador y rompe la imagen.
        return response()->json([
            'url' => parse_url(Storage::disk('public')->url($path), PHP_URL_PATH),
        ]);
    }
}
