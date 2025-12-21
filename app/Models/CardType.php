<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CardType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($cardType) {
            if (empty($cardType->slug)) {
                $cardType->slug = Str::slug($cardType->name);
            }
        });
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
