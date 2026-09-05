<?php

namespace App\Http\Controllers;

use App\Models\Character;
use App\Models\Location;
use App\Models\World;
use App\Support\AmbienteDeLibro;
use App\Support\PaginadorDeLibro;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * La Cronica: el lore entero como libro antiguo, publico y sin login.
 *
 * El reparto en paginas lo hace PaginadorDeLibro y el fondo y la musica el
 * trait AmbienteDeLibro, los dos compartidos con el Manual para que ambos
 * libros se lean exactamente igual.
 */
class ChronicleController extends Controller
{
    use AmbienteDeLibro;

    public function __invoke(Request $request)
    {
        // Cuantas palabras caben depende del tamano real de la hoja, que solo
        // conoce el navegador: en un movil entra la mitad que en un portatil.
        // El libro se mide solo y vuelve a pedir la pagina con su medida.
        $paginador = new PaginadorDeLibro(
            max(50, min(260, (int) $request->integer('wpp', 140)))
        );

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
            foreach ($paginador->repartir($l->description) as $i => $trozo) {
                $paginas[] = [
                    'tipo' => 'lugar',
                    'titulo' => $i === 0 ? $l->name : null,
                    'continua' => $i > 0,
                    'etiqueta' => $i === 0 ? $this->nombreTipo($l->location_type) : null,
                    'imagen' => $i === 0 ? $l->image_url : null,
                    'texto' => $trozo,
                    'palabras' => $paginador->palabras($trozo),
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

            $indice[] = ['titulo' => $c->name, 'pagina' => count($paginas), 'sangria' => true];

            $paginas[] = [
                'tipo' => 'personaje',
                'titulo' => $c->name,
                'epiteto' => $epiteto,
                'imagen' => $c->image_url,
                'faccion' => $c->faction,
                'lugares' => $c->locations->pluck('name')->all(),
                'vinculos' => $c->relacionesVistas()
                    ->map(fn (array $r) => ['tipo' => $r['tipo'], 'nombre' => $r['personaje']->name])
                    ->all(),
            ];

            foreach ($paginador->repartir($cuerpo) as $trozo) {
                $paginas[] = [
                    'tipo' => 'texto',
                    'titulo' => null,
                    'continua' => true,
                    'cabecera' => $c->name,
                    'texto' => $trozo,
                    'palabras' => $paginador->palabras($trozo),
                ];
            }
        }

        $paginas[] = [
            'tipo' => 'colofon',
            'titulo' => 'Colofón',
            'texto' => "Aquí se acaba lo que está escrito.\n\nLo que falta lo cuenta cada cual a su manera, y por eso se juega.",
        ];

        return Inertia::render('Libro', [
            'paginas' => $paginas,
            'indice' => $indice,
            'titulo' => 'Crónica de '.($mundo?->name ?? "Tapon'Azo"),
            'rotulo' => 'Crónica',
            'fondo' => $this->fondoDeTaberna(),
            'musica' => $this->musicaDeAmbiente(),
            'hermano' => ['titulo' => 'El Reglamento', 'url' => '/reglas'],
            'wpp' => $paginador->porPagina(),
        ]);
    }

    /**
     * El epiteto con el que abren las biografias importadas, para lucirlo bajo
     * el nombre en vez de repetirlo dentro del texto. El documento original no
     * es coherente: unas veces es un encabezado (de cualquier nivel, con o sin
     * negrita) y otras una linea suelta en negrita.
     *
     * @return array{0: ?string, 1: string}
     */
    private function separarEpiteto(?string $bio): array
    {
        if (! $bio) {
            return [null, ''];
        }

        $secciones = ['preludio', 'biografia', 'biografía', 'descripcion', 'descripción'];
        $lineas = preg_split('/\r?\n/', ltrim($bio));
        $cabecera = trim($lineas[0] ?? '');

        if (preg_match('/^#{1,3}\s*\**\s*(.+?)\s*\**$/u', $cabecera, $m)
            || preg_match('/^\*\*([^*]+)\*\*$/u', $cabecera, $m)) {
            $epiteto = trim(str_replace(['**', '<u>', '</u>'], '', $m[1]));

            // "Preludio" y compania son secciones, no el epiteto del personaje.
            if (! in_array(mb_strtolower($epiteto), $secciones, true)) {
                return [$epiteto, trim(mb_substr(ltrim($bio), mb_strlen($cabecera)))];
            }
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
