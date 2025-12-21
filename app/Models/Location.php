<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'world_id',
        'name',
        'description',
        'type',
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
