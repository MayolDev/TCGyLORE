<?php

namespace App\Http\Controllers\Admin;

use App\Models\Card;
use App\Models\Character;
use App\Models\CharacterRelation;
use App\Models\Location;
use App\Models\ManualSection;
use App\Models\Story;
use App\Models\TimelineEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Buscador unico sobre todo el proyecto. Cada listado tenia el suyo y no habia
 * forma de preguntar "donde sale Zunle" sin recorrerlos a mano.
 *
 * Busca tambien dentro de los textos largos (biografias, reglas del manual) y
 * devuelve el trozo donde aparece, para no obligar a abrir la ficha entera.
 */
class SearchController extends Controller
{
    /** Cuantos resultados por tipo. Suficiente para ver si esta o no esta. */
    private const TOPE = 12;

    public function __invoke(Request $request)
    {
        $q = trim((string) $request->input('q'));

        if (mb_strlen($q) < 2) {
            return Inertia::render('Admin/Search', [
                'q' => $q,
                'grupos' => [],
                'total' => 0,
            ]);
        }

        $like = '%'.$q.'%';
        $grupos = [];

        $personajes = Character::where('name', 'like', $like)
            ->orWhere('title', 'like', $like)
            ->orWhere('faction', 'like', $like)
            ->orWhere('biography', 'like', $like)
            ->limit(self::TOPE)
            ->get(['id', 'name', 'title', 'faction', 'biography', 'image']);

        $grupos[] = [
            'clave' => 'personajes',
            'titulo' => 'Personajes',
            'icono' => '👤',
            'resultados' => $personajes->map(fn (Character $c) => [
                'titulo' => $c->name,
                'subtitulo' => $c->faction ?: $c->title,
                'extracto' => $this->extracto($c->biography, $q),
                'url' => "/admin/characters/{$c->id}",
                'imagen' => $c->image_url,
            ])->all(),
        ];

        $ubicaciones = Location::where('name', 'like', $like)
            ->orWhere('description', 'like', $like)
            ->limit(self::TOPE)
            ->get(['id', 'name', 'description', 'location_type', 'image']);

        $grupos[] = [
            'clave' => 'ubicaciones',
            'titulo' => 'Ubicaciones',
            'icono' => '📍',
            'resultados' => $ubicaciones->map(fn (Location $l) => [
                'titulo' => $l->name,
                'subtitulo' => $l->location_type,
                'extracto' => $this->extracto($l->description, $q),
                'url' => "/admin/locations/{$l->id}",
                'imagen' => $l->image_url,
            ])->all(),
        ];

        $cartas = Card::where('name', 'like', $like)
            ->orWhere('effect', 'like', $like)
            ->orWhere('flavor_text', 'like', $like)
            ->limit(self::TOPE)
            ->get(['id', 'name', 'effect', 'flavor_text', 'illustration', 'cost', 'taller_data']);

        $grupos[] = [
            'clave' => 'cartas',
            'titulo' => 'Cartas',
            'icono' => '🃏',
            'resultados' => $cartas->map(fn (Card $c) => [
                'titulo' => $c->name,
                'subtitulo' => 'Coste '.$c->cost,
                'extracto' => $this->extracto($c->effect ?: $c->flavor_text, $q),
                'url' => "/admin/cards/{$c->id}/edit",
                'imagen' => $c->illustration_url,
            ])->all(),
        ];

        $manual = ManualSection::where('title', 'like', $like)
            ->orWhere('content', 'like', $like)
            ->limit(self::TOPE)
            ->get(['id', 'title', 'category', 'content']);

        $grupos[] = [
            'clave' => 'manual',
            'titulo' => 'Manual del juego',
            'icono' => '📖',
            'resultados' => $manual->map(fn (ManualSection $m) => [
                'titulo' => $m->title,
                'subtitulo' => $m->category,
                'extracto' => $this->extracto($m->content, $q),
                'url' => '/admin/manual-sections?search='.urlencode($m->title),
                'imagen' => null,
            ])->all(),
        ];

        // Las relaciones se buscan por el texto del vinculo ("Maestro",
        // "Enemigo") y por el matiz, no por el nombre de los dos personajes:
        // para eso ya estan ellos mas arriba.
        $relaciones = CharacterRelation::with(['character:id,name', 'relatedCharacter:id,name'])
            ->where('type', 'like', $like)
            ->orWhere('inverse_type', 'like', $like)
            ->orWhere('notes', 'like', $like)
            ->limit(self::TOPE)
            ->get();

        $grupos[] = [
            'clave' => 'relaciones',
            'titulo' => 'Relaciones',
            'icono' => '🔗',
            'resultados' => $relaciones
                ->filter(fn (CharacterRelation $r) => $r->character && $r->relatedCharacter)
                ->map(fn (CharacterRelation $r) => [
                    'titulo' => $r->character->name.' → '.$r->relatedCharacter->name,
                    'subtitulo' => $r->type,
                    'extracto' => $this->extracto($r->notes, $q),
                    'url' => "/admin/characters/{$r->character_id}",
                    'imagen' => null,
                ])->values()->all(),
        ];

        $historias = Story::where('title', 'like', $like)
            ->orWhere('content', 'like', $like)
            ->limit(self::TOPE)
            ->get(['id', 'title', 'category', 'content']);

        $grupos[] = [
            'clave' => 'historias',
            'titulo' => 'Historias',
            'icono' => '📜',
            'resultados' => $historias->map(fn (Story $s) => [
                'titulo' => $s->title,
                'subtitulo' => $s->category,
                'extracto' => $this->extracto($s->content, $q),
                'url' => "/admin/stories/{$s->id}",
                'imagen' => null,
            ])->all(),
        ];

        $eventos = TimelineEvent::where('name', 'like', $like)
            ->orWhere('description', 'like', $like)
            ->limit(self::TOPE)
            ->get(['id', 'name', 'year', 'description']);

        $grupos[] = [
            'clave' => 'eventos',
            'titulo' => 'Línea de tiempo',
            'icono' => '⏳',
            'resultados' => $eventos->map(fn (TimelineEvent $e) => [
                'titulo' => $e->name,
                'subtitulo' => (string) $e->year,
                'extracto' => $this->extracto($e->description, $q),
                'url' => "/admin/timeline-events/{$e->id}",
                'imagen' => null,
            ])->all(),
        ];

        $grupos = array_values(array_filter($grupos, fn ($g) => count($g['resultados']) > 0));

        return Inertia::render('Admin/Search', [
            'q' => $q,
            'grupos' => $grupos,
            'total' => array_sum(array_map(fn ($g) => count($g['resultados']), $grupos)),
        ]);
    }

    /**
     * El trozo de texto donde aparece lo buscado, limpio de marcas Markdown.
     * Si no aparece en el cuerpo (la coincidencia fue por el titulo) devuelve
     * el arranque del texto.
     */
    private function extracto(?string $texto, string $q): ?string
    {
        if (! $texto) {
            return null;
        }

        $plano = strip_tags($texto);
        $plano = preg_replace('/!\[[^\]]*\]\([^)]*\)/', '', $plano);
        $plano = preg_replace('/[#*_>\[\]]/', '', $plano);
        $plano = trim(preg_replace('/\s+/', ' ', $plano));

        $pos = mb_stripos($plano, $q);
        if ($pos === false) {
            return Str::limit($plano, 160);
        }

        $desde = max(0, $pos - 70);

        return ($desde > 0 ? '…' : '').Str::limit(mb_substr($plano, $desde), 190);
    }
}
