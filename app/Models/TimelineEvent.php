<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TimelineEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'world_id',
        'year',
        'name',
        'description',
        'event_type',
        'importance',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
        ];
    }

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class, 'event_character');
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class, 'event_location');
    }
}
