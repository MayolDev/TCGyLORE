<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Faction extends Model
{
    use HasFactory;

    protected $fillable = ['world_id', 'name', 'slug', 'description', 'color'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($faction) {
            if (empty($faction->slug)) {
                $faction->slug = Str::slug($faction->name);
            }
        });
    }

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
