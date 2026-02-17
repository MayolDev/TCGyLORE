<?php

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\CardType;
use App\Models\Edition;
use App\Models\Faction;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Set up roles
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);

    // Create admin user
    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    // Mock storage
    Storage::fake('public');

    // Create dependencies
    $this->world = World::create(['name' => 'Test World', 'description' => 'A test world']);
    $this->cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
    $this->rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
    $this->alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);
    $this->archetype = Archetype::create(['name' => 'Test Archetype', 'description' => 'Test Description']);
    $this->faction = Faction::create(['name' => 'Test Faction', 'description' => 'Test Description']);
    $this->edition = Edition::create(['name' => 'Test Edition', 'description' => 'Test Description']);
});

test('card controller rejects svg illustration upload', function () {
    // Create a temporary SVG file with content
    $path = sys_get_temp_dir() . '/malicious.svg';
    file_put_contents($path, '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($this->admin)->post('/admin/cards', [
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
    ]);

    $response->assertSessionHasErrors(['illustration']);
});

test('card controller accepts valid jpeg illustration upload', function () {
    $file = UploadedFile::fake()->image('valid.jpg');

    $response = $this->actingAs($this->admin)->post('/admin/cards', [
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
    ]);

    $response->assertSessionHasNoErrors();
    // Redirect means success in this controller
    $response->assertRedirect('/admin/cards');
});

test('location controller rejects svg image upload', function () {
    // Create a temporary SVG file with content
    $path = sys_get_temp_dir() . '/malicious_loc.svg';
    file_put_contents($path, '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

    $file = new UploadedFile($path, 'malicious_loc.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($this->admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});

test('location controller accepts valid jpeg image upload', function () {
    $file = UploadedFile::fake()->image('valid_loc.jpg');

    $response = $this->actingAs($this->admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect('/admin/locations');
});
