<?php

namespace App\Console\Commands;

use App\Models\Card;
use App\Support\MiniaturaDeCarta;
use Illuminate\Console\Command;

class GenerarMiniaturas extends Command
{
    protected $signature = 'cartas:miniaturas {--forzar : Rehace tambien las que ya estan al dia}';

    protected $description = 'Genera las miniaturas de las ilustraciones de carta para la Biblioteca';

    public function handle(): int
    {
        // Redimensionar un PNG de 1792x2400 pide unos 40 MB de pico por
        // imagen entre el origen descomprimido y el destino.
        ini_set('memory_limit', '512M');

        $cartas = Card::query()->whereNotNull('illustration')->get(['id', 'name', 'illustration']);

        if ($cartas->isEmpty()) {
            $this->info('No hay cartas con ilustracion.');

            return self::SUCCESS;
        }

        $barra = $this->output->createProgressBar($cartas->count());
        $barra->start();

        $hechas = $saltadas = $fallidas = 0;
        $ahorro = 0;
        $disco = \Illuminate\Support\Facades\Storage::disk('public');

        foreach ($cartas as $carta) {
            if (! $this->option('forzar') && MiniaturaDeCarta::estaAlDia($carta->illustration)) {
                $saltadas++;
                $barra->advance();

                continue;
            }

            $antes = $disco->exists($carta->illustration) ? $disco->size($carta->illustration) : 0;
            $mini = MiniaturaDeCarta::generar($carta->illustration);

            if ($mini) {
                $hechas++;
                $ahorro += $antes - $disco->size($mini);
            } else {
                $fallidas++;
                $this->newLine();
                $this->warn("  no se pudo con #{$carta->id} {$carta->name} ({$carta->illustration})");
            }

            $barra->advance();
        }

        $barra->finish();
        $this->newLine(2);

        $this->info(sprintf(
            '%d generadas, %d ya estaban, %d fallidas. Ahorro en la rejilla: %.1f MB.',
            $hechas, $saltadas, $fallidas, $ahorro / 1048576
        ));

        return $fallidas > 0 ? self::FAILURE : self::SUCCESS;
    }
}
