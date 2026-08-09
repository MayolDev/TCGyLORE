<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Location extends Model
{
    use HasFactory;

    // El frontend siempre leyó location.image_url pero el accessor no
    // existía: las tarjetas de ubicación nunca enseñaron su imagen.
    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image
            ? parse_url(Storage::disk('public')->url($this->image), PHP_URL_PATH)
            : null;
    }

    protected $fillable = [
        'world_id',
        'name',
        'description',
        'location_type',
        'coordinate_x',
        'coordinate_y',
        'image',
        'is_discovered',
    ];

    protected function casts(): array
    {
        return [
            'is_discovered' => 'boolean',
            'coordinate_x' => 'decimal:2',
            'coordinate_y' => 'decimal:2',
        ];
    }

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    public function timelineEvents(): BelongsToMany
    {
        return $this->belongsToMany(TimelineEvent::class, 'event_location');
    }

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class);
    }
}
