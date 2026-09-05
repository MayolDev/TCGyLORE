<?php

namespace App\Http\Controllers;

use App\Models\ManualSection;
use App\Support\AmbienteDeLibro;
use App\Support\PaginadorDeLibro;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * El Reglamento como libro, igual que la Cronica: mismo pergamino, mismo giro
 * de hoja, misma taberna. Publico, para poder leerlo en la mesa desde el movil
 * sin abrirle el panel a nadie.
 */
class RulebookController extends Controller
{
    use AmbienteDeLibro;

    /** El orden en que se lee el manual, no el alfabetico de la BD. */
    private const ORDEN_CATEGORIAS = ['fundamentos', 'mecanicas', 'cartas', 'lore', 'glosario', 'desarrollo'];

    private const NOMBRE_CATEGORIA = [
        'fundamentos' => 'Fundamentos',
        'mecanicas' => 'Mecánicas',
        'cartas' => 'Cartas',
        'lore' => 'Lore',
        'glosario' => 'Glosario',
        'desarrollo' => 'Desarrollo',
    ];

    private const ENTRADILLA = [
        'fundamentos' => 'Qué es esto y sobre qué se juega.',
        'mecanicas' => 'La ronda, el vigor, los golpes y la muerte.',
        'cartas' => 'Lo que hay dentro del mazo.',
        'lore' => 'De dónde sale todo lo demás.',
        'glosario' => 'Palabras que conviene tener a mano.',
        'desarrollo' => 'Lo que aún no está cerrado.',
    ];

    public function __invoke(Request $request)
    {
        // Cuantas palabras caben depende del tamano real de la hoja, que solo
        // conoce el navegador: en un movil entra la mitad que en un portatil.
        // El libro se mide solo y vuelve a pedir la pagina con su medida.
        $paginador = new PaginadorDeLibro(
            max(50, min(260, (int) $request->integer('wpp', 140)))
        );

        $secciones = ManualSection::where('is_published', true)
            ->get(['id', 'title', 'category', 'content', 'order'])
            // Clave compuesta: primero el bloque, luego el orden dentro de el.
            ->sortBy(fn (ManualSection $s) => sprintf(
                '%02d-%04d',
                array_search($s->category, self::ORDEN_CATEGORIAS, true) === false
                    ? 99
                    : array_search($s->category, self::ORDEN_CATEGORIAS, true),
                $s->order,
            ))
            ->values();

        $paginas = [];
        $indice = [];

        $paginas[] = [
            'tipo' => 'portada',
            'titulo' => 'TAPON’AZO',
            'subtitulo' => 'Reglamento 0.4',
            'pie' => $secciones->count().' capítulos · '
                .$secciones->sum(fn (ManualSection $s) => $paginador->palabras($s->content)).' palabras',
        ];

        $categoriaAnterior = null;

        foreach ($secciones as $s) {
            // Portadilla al cambiar de bloque, para que se note dónde empieza cada parte.
            if ($s->category !== $categoriaAnterior) {
                $categoriaAnterior = $s->category;
                $indice[] = ['titulo' => self::NOMBRE_CATEGORIA[$s->category] ?? $s->category, 'pagina' => count($paginas)];
                $paginas[] = [
                    'tipo' => 'portadilla',
                    'titulo' => self::NOMBRE_CATEGORIA[$s->category] ?? $s->category,
                    'texto' => self::ENTRADILLA[$s->category] ?? null,
                ];
            }

            $indice[] = ['titulo' => $s->title, 'pagina' => count($paginas), 'sangria' => true];

            $trozos = $paginador->repartir($s->content);
            if (! $trozos) {
                $trozos = [''];
            }

            foreach ($trozos as $i => $trozo) {
                $paginas[] = [
                    'tipo' => 'texto',
                    'titulo' => $i === 0 ? $s->title : null,
                    'continua' => $i > 0,
                    'cabecera' => $i === 0 ? null : $s->title,
                    'texto' => $trozo,
                    'palabras' => $paginador->palabras($trozo),
                ];
            }
        }

        $paginas[] = [
            'tipo' => 'colofon',
            'titulo' => 'Colofón',
            'texto' => "Los valores marcados con ⚑ siguen sin balancear.\n\nSe cierran jugando, no discutiendo.",
        ];

        return Inertia::render('Libro', [
            'paginas' => $paginas,
            'indice' => $indice,
            'titulo' => 'Reglamento de Tapon’Azo',
            'rotulo' => 'Reglamento',
            'fondo' => $this->fondoDeTaberna(),
            'musica' => $this->musicaDeAmbiente(),
            'hermano' => ['titulo' => 'La Crónica', 'url' => '/cronica'],
            'wpp' => $paginador->porPagina(),
        ]);
    }
}
