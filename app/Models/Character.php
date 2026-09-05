<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Character extends Model
{
    use HasFactory;

    protected $fillable = [
        'world_id',
        'name',
        'title',
        'image',
        'biography',
        'spells',
        'faction',
        'alignment',
    ];

    protected $appends = ['image_url'];

    /** image admite ruta de storage (subida) o URL externa. */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return str_starts_with($this->image, 'http')
            ? $this->image
            : parse_url(Storage::disk('public')->url($this->image), PHP_URL_PATH);
    }

    /** Legado: la pertenencia real está en worlds() (pivot character_world). */
    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    /** Un personaje puede pertenecer a uno o varios mundos. */
    public function worlds(): BelongsToMany
    {
        return $this->belongsToMany(World::class, 'character_world');
    }

    /**
     * Relaciones que arrancan en este personaje (el es el lado A). NO puede
     * llamarse `relations`: Eloquent ya usa esa propiedad para su cache de
     * relaciones cargadas y desde dentro del modelo tapa al metodo.
     */
    public function outgoingRelations(): HasMany
    {
        return $this->hasMany(CharacterRelation::class);
    }

    /** Relaciones donde este personaje es el lado B: se leen del reves. */
    public function incomingRelations(): HasMany
    {
        return $this->hasMany(CharacterRelation::class, 'related_character_id');
    }

    /**
     * Las relaciones vistas desde este personaje, vengan de donde vengan.
     * Cada fila se guarda una sola vez; aqui se voltea la que llega por el
     * lado B para que el texto siempre se lea "este personaje ES X de aquel".
     */
    public function relacionesVistas(): \Illuminate\Support\Collection
    {
        $propias = $this->outgoingRelations->map(fn (CharacterRelation $r) => [
            'id' => $r->id,
            'tipo' => $r->type,
            'notas' => $r->notes,
            'personaje' => $r->relatedCharacter,
        ]);

        $ajenas = $this->incomingRelations->map(fn (CharacterRelation $r) => [
            'id' => $r->id,
            // Sin inverso declarado la relacion es simetrica ("Hermano de").
            'tipo' => $r->inverse_type ?: $r->type,
            'notas' => $r->notes,
            'personaje' => $r->character,
        ]);

        return $propias->concat($ajenas)
            ->filter(fn ($r) => $r['personaje'] !== null)
            ->sortBy('tipo')
            ->values();
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    public function timelineEvents(): BelongsToMany
    {
        return $this->belongsToMany(TimelineEvent::class, 'event_character');
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class);
    }

    public function stories(): BelongsToMany
    {
        return $this->belongsToMany(Story::class);
    }

    protected function casts(): array
    {
        return [
            'spells' => 'array',
        ];
    }
}
