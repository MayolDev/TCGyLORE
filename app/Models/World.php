<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class World extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'banner_image',
        'is_active',
    ];

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
