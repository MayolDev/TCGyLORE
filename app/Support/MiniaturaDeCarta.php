<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Las ilustraciones del Taller son PNG de 1792x2400 y hasta 9,5 MB. En la
 * rejilla de la Biblioteca se pintan a unos 300 px de ancho, asi que el
 * navegador se descargaba cien megas para enseñar doce miniaturas: de ahi
 * que la pagina tardase o se quedase colgada.
 *
 * Esta clase genera una copia reducida en JPEG al lado del original. El
 * original no se toca nunca: lo necesita el Taller para editar y exportar.
 *
 * Se usa JPEG y no WebP a proposito: la imagen de PHP del servidor trae GD
 * sin soporte WebP, y no merece reconstruirla por un 20% mas de compresion
 * cuando el salto gordo (de 9,5 MB a ~60 KB) ya lo da el redimensionado.
 */
class MiniaturaDeCarta
{
    /** Ancho de la miniatura. La rejilla nunca pinta mas de 400 px reales. */
    public const ANCHO = 600;

    public const CALIDAD = 82;

    /** Donde vive la miniatura de una ilustracion dada. */
    public static function ruta(string $ilustracion): string
    {
        return 'miniaturas/'.preg_replace('/\.\w+$/', '', $ilustracion).'.jpg';
    }

    /** True si la miniatura ya existe y es mas nueva que el original. */
    public static function estaAlDia(string $ilustracion): bool
    {
        $disco = Storage::disk('public');
        $mini = self::ruta($ilustracion);

        return $disco->exists($mini)
            && $disco->lastModified($mini) >= $disco->lastModified($ilustracion);
    }

    /**
     * Genera la miniatura. Devuelve su ruta, o null si no se pudo (formato
     * raro, fichero corrupto, imagen que no cabe en memoria).
     */
    public static function generar(string $ilustracion): ?string
    {
        $disco = Storage::disk('public');

        if (! $disco->exists($ilustracion)) {
            return null;
        }

        $origen = $disco->path($ilustracion);
        $info = @getimagesize($origen);

        if (! $info) {
            return null;
        }

        [$ancho, $alto, $tipo] = $info;

        $imagen = match ($tipo) {
            IMAGETYPE_PNG => @imagecreatefrompng($origen),
            IMAGETYPE_JPEG => @imagecreatefromjpeg($origen),
            IMAGETYPE_GIF => @imagecreatefromgif($origen),
            default => null,
        };

        if (! $imagen) {
            return null;
        }

        // Si ya es pequeña no la agrandamos: solo la reencodamos a JPEG.
        $nuevoAncho = min(self::ANCHO, $ancho);
        $nuevoAlto = (int) round($alto * ($nuevoAncho / $ancho));

        $mini = imagecreatetruecolor($nuevoAncho, $nuevoAlto);

        // El JPEG no tiene alfa: las zonas transparentes del PNG irian a
        // negro aleatorio. Las aplanamos sobre blanco, que es lo que menos
        // canta en los marcos de carta.
        $blanco = imagecolorallocate($mini, 255, 255, 255);
        imagefilledrectangle($mini, 0, 0, $nuevoAncho, $nuevoAlto, $blanco);

        imagecopyresampled($mini, $imagen, 0, 0, 0, 0, $nuevoAncho, $nuevoAlto, $ancho, $alto);
        imagedestroy($imagen);

        $destino = self::ruta($ilustracion);
        $disco->makeDirectory(dirname($destino));

        $ok = imagejpeg($mini, $disco->path($destino), self::CALIDAD);
        imagedestroy($mini);

        return $ok ? $destino : null;
    }
}
