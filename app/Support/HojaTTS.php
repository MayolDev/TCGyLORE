<?php

namespace App\Support;

use App\Models\Deck;
use Illuminate\Support\Facades\Storage;

/**
 * Genera las hojas de rejilla que Tabletop Simulator pide para importar un
 * mazo entero de golpe (Objects > Components > Cards > Custom Deck).
 *
 * TTS lee UNA imagen con las cartas en cuadricula y dos numeros: cuantas
 * columnas y cuantas filas. Cada celda es una carta, asi que las copias hay
 * que expandirlas: un mazo con 3 Goblins ocupa 3 celdas.
 *
 * El limite de TTS es 10x7 = 70 cartas por hoja. Los mazos mas largos se
 * parten en varias hojas, que en TTS se importan por separado y se juntan.
 */
class HojaTTS
{
    /** Tope de TTS. No es configurable: lo impone el juego. */
    public const COLUMNAS = 10;

    public const FILAS = 7;

    public const POR_HOJA = self::COLUMNAS * self::FILAS;

    /** Tamaño de celda. 512x686 mantiene la proporcion de las ilustraciones. */
    public const ANCHO_CELDA = 512;

    public const ALTO_CELDA = 686;

    /**
     * Expande un mazo a la lista de cartas una por copia, en el orden en que
     * se veran en la hoja: protagonista y sendas primero, luego el mazo.
     *
     * @return array<int, \App\Models\Card>
     */
    public static function expandir(Deck $deck, ?string $zona = null): array
    {
        $orden = ['protagonista' => 0, 'senda' => 1, 'principal' => 2, 'side' => 3, 'eventos' => 4];

        $entradas = $deck->cards->filter(fn ($dc) => $dc->card !== null);

        if ($zona) {
            $entradas = $entradas->where('zone', $zona);
        }

        $cartas = [];

        foreach ($entradas->sortBy(fn ($dc) => [$orden[$dc->zone] ?? 9, $dc->card->name]) as $dc) {
            for ($i = 0; $i < $dc->quantity; $i++) {
                $cartas[] = $dc->card;
            }
        }

        return $cartas;
    }

    /**
     * Pinta una hoja con las cartas dadas (como mucho POR_HOJA) y devuelve el
     * PNG en binario, junto con las dimensiones que hay que teclear en TTS.
     *
     * @param  array<int, \App\Models\Card>  $cartas
     * @return array{png: string, columnas: int, filas: int, cartas: int}
     */
    public static function pintar(array $cartas): array
    {
        $cartas = array_slice($cartas, 0, self::POR_HOJA);
        $total = count($cartas);

        // TTS reparte la imagen en columnas x filas exactas, asi que la
        // rejilla se ajusta al numero real de cartas: si sobran celdas, las
        // ultimas salen en blanco y en TTS se borran. Menos celdas vacias
        // cuanto mejor cuadre.
        $columnas = min(self::COLUMNAS, max(1, $total));
        $filas = (int) ceil($total / $columnas);

        $hoja = imagecreatetruecolor($columnas * self::ANCHO_CELDA, $filas * self::ALTO_CELDA);

        // Fondo negro: es lo que menos canta en las celdas sobrantes.
        imagefilledrectangle($hoja, 0, 0, imagesx($hoja), imagesy($hoja), imagecolorallocate($hoja, 0, 0, 0));

        $disco = Storage::disk('public');

        foreach ($cartas as $i => $carta) {
            $x = ($i % $columnas) * self::ANCHO_CELDA;
            $y = intdiv($i, $columnas) * self::ALTO_CELDA;

            // Siempre el original, nunca la miniatura: esto se imprime en la
            // mesa y se mira de cerca.
            if (! $carta->illustration || ! $disco->exists($carta->illustration)) {
                self::marcador($hoja, $x, $y, $carta->name);

                continue;
            }

            $info = @getimagesize($disco->path($carta->illustration));
            $origen = match ($info[2] ?? null) {
                IMAGETYPE_PNG => @imagecreatefrompng($disco->path($carta->illustration)),
                IMAGETYPE_JPEG => @imagecreatefromjpeg($disco->path($carta->illustration)),
                default => null,
            };

            if (! $origen) {
                self::marcador($hoja, $x, $y, $carta->name);

                continue;
            }

            imagecopyresampled(
                $hoja, $origen,
                $x, $y, 0, 0,
                self::ANCHO_CELDA, self::ALTO_CELDA,
                imagesx($origen), imagesy($origen)
            );
            imagedestroy($origen);
        }

        ob_start();
        imagepng($hoja, null, 6);
        $png = ob_get_clean();
        imagedestroy($hoja);

        return ['png' => $png, 'columnas' => $columnas, 'filas' => $filas, 'cartas' => $total];
    }

    /** Celda de relleno para una carta sin ilustracion: que se vea cual falta. */
    private static function marcador($hoja, int $x, int $y, string $nombre): void
    {
        imagefilledrectangle($hoja, $x + 4, $y + 4, $x + self::ANCHO_CELDA - 4, $y + self::ALTO_CELDA - 4,
            imagecolorallocate($hoja, 40, 40, 48));
        imagestring($hoja, 5, $x + 16, $y + self::ALTO_CELDA / 2, substr($nombre, 0, 40),
            imagecolorallocate($hoja, 220, 200, 120));
    }
}
