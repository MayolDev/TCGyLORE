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
