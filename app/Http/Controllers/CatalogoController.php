<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Support\MiniaturaDeCarta;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * El catálogo de cartas, para que se lo pueda comer el motor de la mesa.
 *
 * La clave es `taller_data.id`: el slug con el que el Taller bautiza la carta
 * («campesino-leal») es EXACTAMENTE el identificador que usa el motor. Hasta
 * ahora los dos sistemas se cruzaban por NOMBRE normalizado, con lo que
 * renombrar una carta la dejaba sin ilustración y sin que nada avisara. Con el
 * slug dentro de la respuesta, ese puente desaparece.
 *
 * Es de solo lectura y pública a propósito: no hay nada aquí que no esté ya
 * impreso en la carta.
 */
class CatalogoController extends Controller
{
    public function index(): JsonResponse
    {
        $cartas = Card::query()
            ->whereNotNull('taller_data')
            ->with('rarity')                 // sin esto son 149 consultas mas
            ->orderBy('name')
            ->get()
            ->map(fn (Card $c) => $this->carta($c))
            ->filter()
            ->values();

        // La versión es un hash del contenido, no una fecha: así dos exportaciones
        // iguales dan la misma versión y la mesa sabe cuándo NO tiene que hacer nada.
        $version = substr(sha1($cartas->toJson()), 0, 12);

        return response()->json([
            'version' => $version,
            'generado' => now()->toIso8601String(),
            'cuantas' => $cartas->count(),
            'cartas' => $cartas,
        ])->header('Cache-Control', 'public, max-age=60');
    }

    /**
     * Una carta en el vocabulario del motor. Devuelve null si no lleva slug: sin
     * él no hay forma de saber a qué carta del motor corresponde, y colarla por
     * el nombre es justo el puente que estamos quitando.
     */
    private function carta(Card $c): ?array
    {
        $t = json_decode((string) $c->taller_data, true);
        if (! is_array($t) || empty($t['id'])) {
            return null;
        }

        return [
            'id' => $t['id'],
            'nombre' => $t['nombre'] ?? $c->name,
            'tipo' => $t['tipo'] ?? null,

            // Los números del balance. En `taller_data` van como cadenas —los
            // escribe un <input> del Taller— y vacío no es cero: una criatura sin
            // ATQ es que no lo tiene, no que pegue 0. Por eso null y no 0.
            'coste' => $this->numero($t['coste'] ?? null, $c->cost),
            'atq' => $this->numero($t['atq'] ?? null, $c->strength),
            'def' => $this->numero($t['def'] ?? null, $c->defense),
            'ego' => $this->numero($t['ego'] ?? null, $c->ego),

            'texto' => trim((string) ($t['texto'] ?? $c->effect ?? '')),
            'etiquetas' => $t['etiquetas'] ?? null,

            // La rareza sale de la RELACIÓN, no de `taller_data`: ahí «rareza» es
            // el marco que has elegido para dibujarla, no la rareza de reglas. Hay
            // Campesinos de 1 Vigor guardados como «legendaria» porque llevan marco
            // dorado, y el motor tiene un test que comprueba las bandas del §8.
            'rareza' => $c->rarity?->name,

            'arte' => $this->arte($c),
            'carta' => $this->montada($c),
        ];
    }

    /** Entero, o null si no hay nada que leer. El Taller guarda cadenas. */
    private function numero(mixed $delTaller, mixed $deLaColumna): ?int
    {
        $v = is_string($delTaller) ? trim($delTaller) : $delTaller;
        if ($v !== null && $v !== '' && is_numeric($v)) {
            return (int) $v;
        }

        return $deLaColumna === null ? null : (int) $deLaColumna;
    }

    /** El arte suelto: va por id numérico, y por eso cambiarlo se ve sin redesplegar. */
    private function arte(Card $c): ?string
    {
        $ruta = "miniaturas/art/{$c->id}.jpg";

        return Storage::disk('public')->exists($ruta)
            ? Storage::disk('public')->url($ruta)
            : null;
    }

    /** La carta montada entera, con su marco y sus números. */
    private function montada(Card $c): ?string
    {
        if (! $c->illustration) {
            return null;
        }

        $mini = MiniaturaDeCarta::ruta($c->illustration);
        $ruta = Storage::disk('public')->exists($mini) ? $mini : $c->illustration;

        return Storage::disk('public')->url($ruta);
    }
}
