<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'card_id',
        'card_name',
        'user_id',
        'user_name',
        'action',
        'source',
        'changes',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'changes' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    /** Apunta una entrada del historial de una carta, con su autor. */
    public static function apuntar(Card $card, string $action, string $source, ?array $changes = null): void
    {
        $usuario = auth()->user();

        static::create([
            'card_id' => $card->id,
            'card_name' => $card->name,
            'user_id' => $usuario?->id,
            'user_name' => $usuario?->name,
            'action' => $action,
            'source' => $source,
            'changes' => $changes ?: null,
            'created_at' => now(),
        ]);
    }
}
