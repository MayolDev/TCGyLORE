<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$start = microtime(true);

$cards = App\Models\Card::query()
    ->with(['world', 'character', 'cardType', 'rarity', 'archetype', 'alignment', 'faction', 'edition', 'artist'])
    ->latest()
    ->paginate(12)
    ->withQueryString();

$end = microtime(true);
echo "Time with all relations: " . ($end - $start) . " seconds\n";

$start2 = microtime(true);

$cards2 = App\Models\Card::query()
    ->with(['world:id,name', 'character:id,name', 'cardType:id,name', 'rarity:id,name'])
    ->latest()
    ->paginate(12)
    ->withQueryString();

$end2 = microtime(true);
echo "Time with limited relations: " . ($end2 - $start2) . " seconds\n";
