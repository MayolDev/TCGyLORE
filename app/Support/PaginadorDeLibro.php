<?php

namespace App\Support;

/**
 * Reparte texto en paginas de libro.
 *
 * Se hace aqui, en el servidor, y no midiendo en el navegador: con decenas de
 * miles de palabras, medir en cliente obligaria a recalcular cientos de
 * paginas en cada carga. Repartir por parrafos con un tope de palabras es como
 * se maqueta un libro de verdad y ademas sale estable: la misma pagina siempre
 * enseña lo mismo, asi que se puede compartir el enlace.
 */
class PaginadorDeLibro
{
    public function __construct(
        /** Palabras que caben comodas en una pagina con la tipografia del libro. */
        private int $porPagina = 140,
    ) {}

    /**
     * Reparte un texto sin cortar parrafos por la mitad. Un parrafo mas largo
     * que una pagina entera se parte por frases, que es lo menos malo.
     *
     * @return list<string>
     */
    public function repartir(?string $texto): array
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

            $palabras = $this->palabras($p);

            if ($palabras > $this->porPagina) {
                $cerrar();
                foreach ($this->partirPorFrases($p) as $trozo) {
                    $paginas[] = $trozo;
                }

                continue;
            }

            if ($cuenta + $palabras > $this->porPagina) {
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
            $n = $this->palabras($f);
            if ($cuenta + $n > $this->porPagina && $actual) {
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

    /** str_word_count parte las palabras con tilde: "cancion" cuenta 1, "canción" 2. */
    public function palabras(string $texto): int
    {
        return preg_match_all('/\S+/u', strip_tags($texto)) ?: 0;
    }
}
