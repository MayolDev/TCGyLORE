<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Admin']);

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    $this->world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);
});

test('it prevents svg upload for location image', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->create('image.svg', 100, 'image/svg+xml');

    $response = $this->actingAs($this->admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors('image');
});

test('it allows valid image upload for location image', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('image.png');

    $response = $this->actingAs($this->admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasNoErrors();
});
