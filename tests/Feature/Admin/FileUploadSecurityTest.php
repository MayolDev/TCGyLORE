<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);
});

test('admin cannot upload insecure file type (BMP)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    // Create a BMP file (technically an image, but not allowed by our new policy)
    $file = UploadedFile::fake()->create('test.bmp', 100, 'image/bmp');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});

test('admin can upload valid image', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    $file = UploadedFile::fake()->image('valid.jpg');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertRedirect(route('admin.locations.index'));
});
