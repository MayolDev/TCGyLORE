<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Archetype extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($archetype) {
            if (empty($archetype->slug)) {
                $archetype->slug = Str::slug($archetype->name);
            }
        });
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
