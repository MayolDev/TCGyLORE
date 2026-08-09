<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class World extends Model
{
    use HasFactory;

    /** Mapa base que se usa cuando el mundo no tiene uno propio subido. */
    public const DEFAULT_MAP = '/images/map-aethermoor.webp';

    protected $fillable = [
        'name',
        'description',
        'banner_image',
        'map_image',
        'is_active',
    ];

    protected $appends = ['map_image_url', 'image_url'];

    /** banner_image admite ruta de storage (subida) o URL externa. */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->banner_image) {
            return null;
        }

        return str_starts_with($this->banner_image, 'http')
            ? $this->banner_image
            : parse_url(Storage::disk('public')->url($this->banner_image), PHP_URL_PATH);
    }

    public function getMapImageUrlAttribute(): string
    {
        return $this->map_image
            ? parse_url(Storage::disk('public')->url($this->map_image), PHP_URL_PATH)
            : self::DEFAULT_MAP;
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function stories(): HasMany
    {
        return $this->hasMany(Story::class);
    }

    public function characters(): HasMany
    {
        return $this->hasMany(Character::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function timelineEvents(): HasMany
    {
        return $this->hasMany(TimelineEvent::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
