<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Story extends Model
{
    use HasFactory;

    protected $fillable = [
        'world_id',
        'title',
        'slug',
        'content',
        'category',
        'cover_image',
        'era',
        'order',
        'is_published',
    ];

    protected $appends = ['image_url'];

    /** cover_image admite ruta de storage (subida) o URL externa. */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        return str_starts_with($this->cover_image, 'http')
            ? $this->cover_image
            : parse_url(Storage::disk('public')->url($this->cover_image), PHP_URL_PATH);
    }

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'order' => 'integer',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($story) {
            if (empty($story->slug)) {
                $story->slug = Str::slug($story->title);
            }
        });
    }

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class);
    }
}
