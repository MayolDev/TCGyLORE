<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    use HasFactory;

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
