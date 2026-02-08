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
    // Setup roles
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);

    Storage::fake('public');
});

test('svg upload is rejected for cards', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
    $cardType = CardType::create(['name' => 'Test Type']);
    $rarity = Rarity::create(['name' => 'Test Rarity']);
    $alignment = Alignment::create(['name' => 'Test Alignment']);

    // Create a fake SVG file
    $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'name' => 'Test Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
    ]);

    $response->assertSessionHasErrors(['illustration']);
});

test('svg upload is rejected for locations', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

    // Create a fake SVG file
    $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});
