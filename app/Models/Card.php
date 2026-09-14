<?php

namespace App\Models;

use App\Support\MiniaturaDeCarta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Card extends Model
{
    use HasFactory;

    /**
     * El frontend lee `illustration_url`, pero la columna guarda la ruta de
     * storage. Sin este accessor las ilustraciones subidas no se mostraban
     * nunca: todas las cartas caian al placeholder.
     */
    protected $appends = ['illustration_url', 'illustration_thumb_url', 'is_foil'];

    /** Acabado foil elegido en el taller: la web le pone el brillo animado. */
    public function getIsFoilAttribute(): bool
    {
        if (! $this->taller_data) {
            return false;
        }
        $datos = json_decode($this->taller_data, true);

        return (bool) ($datos['foil'] ?? false);
    }

    public function getIllustrationUrlAttribute(): ?string
    {
        return $this->illustration
            ? parse_url(Storage::disk('public')->url($this->illustration), PHP_URL_PATH)
            : null;
    }

    /**
     * Version ligera para las rejillas. El original es un PNG de 1792x2400 y
     * hasta 9,5 MB; pintar doce de esos era lo que colgaba la Biblioteca.
     *
     * Si la miniatura todavia no existe cae al original, asi que una carta
     * recien subida se ve igual aunque pese: nunca se rompe la imagen.
     */
    public function getIllustrationThumbUrlAttribute(): ?string
    {
        if (! $this->illustration) {
            return null;
        }

        $mini = MiniaturaDeCarta::ruta($this->illustration);

        return Storage::disk('public')->exists($mini)
            ? parse_url(Storage::disk('public')->url($mini), PHP_URL_PATH)
            : $this->illustration_url;
    }

    protected $fillable = [
        'world_id',
        'character_id',
        'name',
        'illustration',
        'effect',
        'strength',
        'agility',
        'charisma',
        // EGO de la criatura (0-6). Solo las criaturas lo tienen: null en el resto.
        'ego',
        'mind',
        'defense',
        'magic_defense',
        'health',
        'cost',
        'card_type_id',
        'rarity_id',
        'archetype_id',
        'alignment_id',
        'faction_id',
        'edition_id',
        'artist_id',
        'flavor_text',
        'taller_data',
    ];

    protected function casts(): array
    {
        return [
            'strength' => 'integer',
            'agility' => 'integer',
            'charisma' => 'integer',
            'ego' => 'integer',
            'mind' => 'integer',
            'defense' => 'integer',
            'magic_defense' => 'integer',
            'health' => 'integer',
            'cost' => 'integer',
        ];
    }

    /**
     * La ilustracion se guarda desde tres sitios (el Taller, y el alta y la
     * edicion del panel). En vez de acordarse en los tres, la miniatura se
     * genera aqui siempre que la columna cambie.
     *
     * Va en caliente y no en cola a proposito: tarda cerca de un segundo y
     * es una accion de administracion, y asi la carta nunca queda sin
     * miniatura si la cola esta parada.
     */
    protected static function booted(): void
    {
        static::saved(function (self $carta) {
            if (! $carta->wasChanged('illustration') || ! $carta->illustration) {
                return;
            }

            $anterior = $carta->getOriginal('illustration');
            if ($anterior && $anterior !== $carta->illustration) {
                Storage::disk('public')->delete(MiniaturaDeCarta::ruta($anterior));
            }

            MiniaturaDeCarta::generar($carta->illustration);
        });

        static::deleted(function (self $carta) {
            if ($carta->illustration) {
                Storage::disk('public')->delete(MiniaturaDeCarta::ruta($carta->illustration));
            }
        });
    }

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class);
    }

    public function logs()
    {
        return $this->hasMany(CardLog::class)->orderByDesc('created_at');
    }

    public function cardType(): BelongsTo
    {
        return $this->belongsTo(CardType::class);
    }

    public function rarity(): BelongsTo
    {
        return $this->belongsTo(Rarity::class);
    }

    public function archetype(): BelongsTo
    {
        return $this->belongsTo(Archetype::class);
    }

    public function alignment(): BelongsTo
    {
        return $this->belongsTo(Alignment::class);
    }

    public function faction(): BelongsTo
    {
        return $this->belongsTo(Faction::class);
    }

    public function edition(): BelongsTo
    {
        return $this->belongsTo(Edition::class);
    }

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    /**
     * El mismo marcado ligero que pinta el Taller en la carta, para que la
     * web enseñe el efecto igual que se ve impreso. Antes esto usaba `***`
     * para la negrita, que no es lo que entiende el Taller, y no lo llamaba
     * nadie.
     */
    public function getFormattedEffectAttribute(): string
    {
        $lineas = [];

        foreach (explode("\n", (string) $this->effect) as $linea) {
            $t = trim($linea);

            if ($t === '---') {
                $lineas[] = '<hr class="my-2 border-current/30">';

                continue;
            }

            $esTitulo = str_starts_with($t, '## ');
            $esVineta = (bool) preg_match('/^[-•]\s+/u', $t);

            $cuerpo = $esTitulo ? substr($t, 3) : preg_replace('/^[-•]\s+/u', '', $t);
            $cuerpo = e($cuerpo);

            // Orden importante: el triple antes que el doble y que el simple.
            $cuerpo = preg_replace('/\*\*\*(.+?)\*\*\*/s', '<strong><em>$1</em></strong>', $cuerpo);
            $cuerpo = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $cuerpo);
            $cuerpo = preg_replace('/\*(.+?)\*/s', '<em>$1</em>', $cuerpo);

            if ($esTitulo) {
                $lineas[] = '<strong class="block mt-2 uppercase tracking-wide">'.$cuerpo.'</strong>';
            } elseif ($esVineta) {
                $lineas[] = '<span class="block pl-4 -indent-3">• '.$cuerpo.'</span>';
            } else {
                $lineas[] = '<span class="block">'.$cuerpo.'</span>';
            }
        }

        return implode('', $lineas);
    }
}
