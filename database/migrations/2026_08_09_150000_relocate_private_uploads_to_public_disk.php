<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Storage;

/**
 * Los uploads del editor, mapas de mundo e imágenes de ubicación se guardaban
 * con Storage::putFile(..., 'public') — que es la VISIBILIDAD, no el disco —
 * y acababan en el disco privado (storage/app/private), donde nginx no los
 * sirve. Esta migración mueve lo ya subido al disco public. Idempotente:
 * sin ficheros en privado, no hace nada.
 */
return new class extends Migration
{
    private const DIRECTORIOS = ['editor-images', 'worlds', 'locations'];

    public function up(): void
    {
        $privado = Storage::disk('local');
        $publico = Storage::disk('public');

        foreach (self::DIRECTORIOS as $dir) {
            foreach ($privado->files($dir) as $fichero) {
                if (! $publico->exists($fichero)) {
                    $publico->put($fichero, $privado->get($fichero));
                }
                $privado->delete($fichero);
            }
        }
    }

    public function down(): void
    {
        // Sin marcha atrás: los ficheros en public siguen siendo válidos.
    }
};
