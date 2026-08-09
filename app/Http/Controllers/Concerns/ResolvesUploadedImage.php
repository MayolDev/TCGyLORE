<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Las entidades de lore aceptan su imagen de dos maneras: fichero subido
 * (campo 'image') o URL externa (campo 'image_url'). Ambas acaban en la misma
 * columna; el accessor image_url del modelo distingue por el prefijo http.
 */
trait ResolvesUploadedImage
{
    /**
     * Valor a guardar en la columna de imagen, o null si no llegó nada
     * (en ese caso se conserva el valor actual).
     */
    protected function resolveImage(Request $request, ?string $actual, string $directorio): ?string
    {
        if ($request->hasFile('image')) {
            $this->deleteStoredImage($actual);

            return Storage::disk('public')->putFile($directorio, $request->file('image'));
        }

        if ($request->filled('image_url')) {
            $url = $request->input('image_url');

            // Un /storage/... es un fichero nuestro ya guardado (el formulario
            // puede reenviar el valor del accessor): no tocar nada.
            if (str_starts_with($url, '/storage/')) {
                return null;
            }

            if ($url !== $actual) {
                $this->deleteStoredImage($actual);
            }

            return $url;
        }

        return null;
    }

    /** Borra el fichero solo si es una ruta de storage, nunca una URL externa. */
    protected function deleteStoredImage(?string $valor): void
    {
        if ($valor && ! str_starts_with($valor, 'http')) {
            Storage::disk('public')->delete($valor);
        }
    }
}
