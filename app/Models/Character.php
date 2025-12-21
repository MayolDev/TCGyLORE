<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
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
