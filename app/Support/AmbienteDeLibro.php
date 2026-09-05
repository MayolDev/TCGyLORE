<?php

namespace App\Support;

use App\Models\Location;
use Illuminate\Support\Facades\Storage;

/**
 * Lo que rodea al libro: el fondo de la taberna y la musica de ambiente.
 * Lo comparten la Cronica y el Manual para que los dos se lean igual.
 */
trait AmbienteDeLibro
{
    /** Formatos que sirve el navegador, en el orden en que se prefieren. */
    private const FORMATOS_MUSICA = ['ogg', 'mp3', 'm4a', 'webm'];

    /**
     * Ilustracion de fondo: la de la Venta, si alguna tiene. Si no hay, la
     * pagina se apana con la taberna dibujada en CSS.
     */
    private function fondoDeTaberna(): ?string
    {
        return Location::where('location_type', 'tavern')
            ->whereNotNull('image')
            ->first(['id', 'image'])
            ?->image_url;
    }

    /**
     * Musica de ambiente, si esta puesta. Se busca por nombre fijo en el disco
     * publico: no hay tabla ni pantalla que administrar, se deja el fichero en
     * storage/app/public/libro/ y aparece el altavoz.
     */
    private function musicaDeAmbiente(): ?string
    {
        foreach (self::FORMATOS_MUSICA as $ext) {
            $ruta = "libro/ambiente.{$ext}";
            if (Storage::disk('public')->exists($ruta)) {
                return parse_url(Storage::disk('public')->url($ruta), PHP_URL_PATH);
            }
        }

        return null;
    }
}
