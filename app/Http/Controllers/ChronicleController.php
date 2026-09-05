<?php

namespace App\Http\Controllers;

use App\Models\Character;
use App\Models\Location;
use App\Models\World;
use Inertia\Inertia;

/**
 * La Cronica: el lore entero como libro antiguo, publico y sin login.
 *
 * Las paginas se arman aqui, en el servidor, y no midiendo en el navegador:
 * con 62 fichas y cerca de 40.000 palabras, medir en cliente significaria
 * recalcular cientos de paginas en cada carga. Se reparte por parrafos con un
 * tope de palabras por pagina, que es como se maqueta un libro de verdad y
 * ademas es estable: la misma pagina 87 siempre enseña lo mismo, asi que se
 * puede compartir el enlace.
 */
class ChronicleController extends Controller
{
    /** Palabras que caben comodas en una pagina con esta tipografia. */
    private const PALABRAS_POR_PAGINA = 190;

    public function __invoke()
    {
        $mundo = World::orderBy('id')->first();

        $personajes = Character::with([
            'outgoingRelations.relatedCharacter:id,name',
            'incomingRelations.character:id,name',
            'locations:id,name',
        ])->orderBy('name')->get();

        $ubicaciones = Location::where('is_discovered', true)
            ->orderBy('location_type')
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'location_type', 'image']);

        $paginas = [];
        $indice = [];

        // ── Portada ───────────────────────────────────────────────────────
        $paginas[] = [
            'tipo' => 'portada',
            'titulo' => $mundo?->name ?? "Tapon'Azo",
            'subtitulo' => 'Crónica del mundo',
            'pie' => count($personajes).' almas · '.count($ubicaciones).' lugares',
        ];

        // ── Parte I: el mundo ─────────────────────────────────────────────
        $indice[] = ['titulo' => 'El mundo', 'pagina' => count($paginas)];
        $paginas[] = [
            'tipo' => 'portadilla',
            'titulo' => 'El mundo',
            'texto' => 'Los reinos, las ciudades y las ventas donde todo esto ocurrió.',
        ];

        foreach ($ubicaciones as $l) {
            foreach ($this->repartir($l->description) as $i => $trozo) {
                $paginas[] = [
                    'tipo' => 'lugar',
                    'titulo' => $i === 0 ? $l->name : null,
                    'continua' => $i > 0,
                    'etiqueta' => $i === 0 ? $this->nombreTipo($l->location_type) : null,
                    'imagen' => $i === 0 ? $l->image_url : null,
                    'texto' => $trozo,
                ];
            }
        }

        // ── Parte II: el elenco ───────────────────────────────────────────
        $indice[] = ['titulo' => 'El elenco', 'pagina' => count($paginas)];
        $paginas[] = [
            'tipo' => 'portadilla',
            'titulo' => 'El elenco',
            'texto' => 'Quiénes fueron, a quién quisieron y quién los mató.',
        ];

        foreach ($personajes as $c) {
            [$epiteto, $cuerpo] = $this->separarEpiteto($c->biography);

            $vinculos = $c->relacionesVistas()
                ->map(fn (array $r) => ['tipo' => $r['tipo'], 'nombre' => $r['personaje']->name])
                ->all();

            $indice[] = ['titulo' => $c->name, 'pagina' => count($paginas), 'sangria' => true];

            // Pagina de entrada: retrato, nombre y vinculos. Luego el texto.
            $paginas[] = [
                'tipo' => 'personaje',
                'titulo' => $c->name,
                'epiteto' => $epiteto,
                'imagen' => $c->image_url,
                'faccion' => $c->faction,
                'lugares' => $c->locations->pluck('name')->all(),
                'vinculos' => $vinculos,
            ];

            foreach ($this->repartir($cuerpo) as $trozo) {
                $paginas[] = [
                    'tipo' => 'texto',
                    'titulo' => null,
                    'continua' => true,
                    'cabecera' => $c->name,
                    'texto' => $trozo,
                ];
            }
        }

        // ── Colofon ───────────────────────────────────────────────────────
        $paginas[] = [
            'tipo' => 'colofon',
            'titulo' => 'Colofón',
            'texto' => "Aquí se acaba lo que está escrito.\n\nLo que falta lo cuenta cada cual a su manera, y por eso se juega.",
        ];

        return Inertia::render('Cronica', [
            'paginas' => $paginas,
            'indice' => $indice,
            'mundo' => $mundo?->name ?? "Tapon'Azo",
        ]);
    }

    /**
     * Reparte un texto en paginas sin cortar parrafos por la mitad. Un parrafo
     * mas largo que una pagina entera se parte por frases, que es lo menos malo.
     *
     * @return list<string>
     */
    private function repartir(?string $texto): array
    {
        if (! $texto || trim($texto) === '') {
            return [];
        }

        $parrafos = preg_split('/\n{2,}/', trim($texto));
        $paginas = [];
        $actual = [];
        $cuenta = 0;

        $cerrar = function () use (&$paginas, &$actual, &$cuenta) {
            if ($actual) {
                $paginas[] = implode("\n\n", $actual);
                $actual = [];
                $cuenta = 0;
            }
        };

        foreach ($parrafos as $p) {
            $p = trim($p);
            if ($p === '') {
                continue;
            }

            $palabras = str_word_count(strip_tags($p));

            // Parrafo gigante: se parte por frases.
            if ($palabras > self::PALABRAS_POR_PAGINA) {
                $cerrar();
                foreach ($this->partirPorFrases($p) as $trozo) {
                    $paginas[] = $trozo;
                }

                continue;
            }

            if ($cuenta + $palabras > self::PALABRAS_POR_PAGINA) {
                $cerrar();
            }

            $actual[] = $p;
            $cuenta += $palabras;
        }

        $cerrar();

        return $paginas;
    }

    /** @return list<string> */
    private function partirPorFrases(string $parrafo): array
    {
        $frases = preg_split('/(?<=[.!?…])\s+/u', $parrafo);
        $salida = [];
        $actual = [];
        $cuenta = 0;

        foreach ($frases as $f) {
            $n = str_word_count(strip_tags($f));
            if ($cuenta + $n > self::PALABRAS_POR_PAGINA && $actual) {
                $salida[] = implode(' ', $actual);
                $actual = [];
                $cuenta = 0;
            }
            $actual[] = $f;
            $cuenta += $n;
        }

        if ($actual) {
            $salida[] = implode(' ', $actual);
        }

        return $salida;
    }

    /**
     * El epiteto con el que abren las biografias importadas, para lucirlo bajo
     * el nombre en vez de repetirlo dentro del texto. El documento original no
     * es coherente: unas veces es un encabezado y otras una linea en negrita.
     *
     * @return array{0: ?string, 1: string}
     */
    private function separarEpiteto(?string $bio): array
    {
        if (! $bio) {
            return [null, ''];
        }

        $lineas = preg_split('/\r?\n/', ltrim($bio));
        $cabecera = trim($lineas[0] ?? '');

        if (preg_match('/^###\s+(.+)$/', $cabecera, $m) || preg_match('/^\*\*([^*]+)\*\*$/', $cabecera, $m)) {
            $epiteto = trim(str_replace(['**', '<u>', '</u>'], '', $m[1]));

            return [$epiteto, trim(substr(ltrim($bio), strlen($cabecera)))];
        }

        return [null, $bio];
    }

    private function nombreTipo(?string $tipo): string
    {
        return [
            'castle' => 'Reino',
            'city' => 'Ciudad',
            'village' => 'Aldea',
            'forest' => 'Bosque',
            'mountain' => 'Montaña',
            'dungeon' => 'Mazmorra',
            'ruins' => 'Ruinas',
            'battlefield' => 'Campo de batalla',
            'port' => 'Puerto',
            'temple' => 'Templo',
            'cave' => 'Cueva',
            'tower' => 'Torre',
            'tavern' => 'Venta',
        ][$tipo] ?? 'Lugar';
    }
}
