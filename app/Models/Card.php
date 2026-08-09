<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Card extends Model
{
    use HasFactory;

    /**
     * El frontend lee `illustration_url`, pero la columna guarda la ruta de
     * storage. Sin este accessor las ilustraciones subidas no se mostraban
     * nunca: todas las cartas caian al placeholder.
     */
    protected $appends = ['illustration_url'];

    public function getIllustrationUrlAttribute(): ?string
    {
        return $this->illustration
            ? parse_url(Storage::disk('public')->url($this->illustration), PHP_URL_PATH)
            : null;
    }

    protected $fillable = [
        'world_id',
        'character_id',
        'name',
        'illustration',
        'effect',
        'strength',
        'agility',
        'charisma',
        'mind',
        'defense',
        'magic_defense',
        'health',
        'cost',
        'card_type_id',
        'rarity_id',
        'archetype_id',
        'alignment_id',
        'faction_id',
        'edition_id',
        'artist_id',
        'flavor_text',
        'taller_data',
    ];

    protected function casts(): array
    {
        return [
            'strength' => 'integer',
            'agility' => 'integer',
            'charisma' => 'integer',
            'mind' => 'integer',
            'defense' => 'integer',
            'magic_defense' => 'integer',
            'health' => 'integer',
            'cost' => 'integer',
        ];
    }

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class);
    }

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class);
    }

    public function logs()
    {
        return $this->hasMany(CardLog::class)->orderByDesc('created_at');
    }

    public function cardType(): BelongsTo
    {
        return $this->belongsTo(CardType::class);
    }

    public function rarity(): BelongsTo
    {
        return $this->belongsTo(Rarity::class);
    }

    public function archetype(): BelongsTo
    {
        return $this->belongsTo(Archetype::class);
    }

    public function alignment(): BelongsTo
    {
        return $this->belongsTo(Alignment::class);
    }

    public function faction(): BelongsTo
    {
        return $this->belongsTo(Faction::class);
    }

    public function edition(): BelongsTo
    {
        return $this->belongsTo(Edition::class);
    }

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    public function getFormattedEffectAttribute(): string
    {
        $text = $this->effect;

        // Convertir ***texto*** a <strong>texto</strong>
        $text = preg_replace('/\*\*\*(.*?)\*\*\*/', '<strong>$1</strong>', $text);

        // Convertir --- a <hr>
        $text = str_replace('---', '<hr class="my-2">', $text);

        return $text;
    }
}
