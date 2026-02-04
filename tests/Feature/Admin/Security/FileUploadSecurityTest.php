<?php

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Admin']);
    Storage::fake('public');
});

test('admin can upload valid image to location', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');
    $world = World::create(['name' => 'Test World', 'description' => 'Desc']);

    $file = UploadedFile::fake()->image('map.png');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'New Location',
        'description' => 'A secure place',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('locations', ['name' => 'New Location']);
});

test('admin cannot upload svg to location', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');
    $world = World::create(['name' => 'Test World', 'description' => 'Desc']);

    // Create a fake SVG file
    $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Bad Location',
        'description' => 'A insecure place',
        'location_type' => 'city',
        'image' => $file,
    ]);

    // Expect validation error on 'image'
    $response->assertSessionHasErrors('image');
});

test('admin cannot upload svg to card', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');
    $world = World::create(['name' => 'Test World', 'description' => 'Desc']);
    $cardType = CardType::create(['name' => 'Type 1', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'Rare', 'description' => 'Desc']);
    $alignment = Alignment::create(['name' => 'Good', 'description' => 'Desc']);

    $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'name' => 'Bad Card',
        'effect' => 'Do nothing',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'illustration' => $file,
    ]);

    $response->assertSessionHasErrors('illustration');
});
