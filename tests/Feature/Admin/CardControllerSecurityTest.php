<?php

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('it rejects svg uploads to prevent stored xss', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create dependencies
    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    $cardType = CardType::create([
        'name' => 'Test Type',
        'description' => 'A test type',
    ]);

    $rarity = Rarity::create([
        'name' => 'Test Rarity',
        'description' => 'A test rarity',
    ]);

    $alignment = Alignment::create([
        'name' => 'Test Alignment',
        'description' => 'A test alignment',
    ]);

    // Create a fake SVG file with valid content
    $content = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" x="0" y="0" fill="red" /></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $content);

    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'name' => 'Malicious Card',
        'effect' => 'This card executes XSS',
        'cost' => 5,
        'illustration' => $file,
    ]);

    // Assert that the illustration field has a validation error
    $response->assertSessionHasErrors(['illustration']);
});
