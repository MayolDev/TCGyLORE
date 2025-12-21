<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Alignment extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'icon', 'description'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($alignment) {
            if (empty($alignment->slug)) {
                $alignment->slug = Str::slug($alignment->name);
            }
        });
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
