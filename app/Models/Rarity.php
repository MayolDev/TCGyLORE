<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Rarity extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'color', 'order'];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($rarity) {
            if (empty($rarity->slug)) {
                $rarity->slug = Str::slug($rarity->name);
            }
        });
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
