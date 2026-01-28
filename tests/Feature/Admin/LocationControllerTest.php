<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create roles
    Role::firstOrCreate(['name' => 'Admin']);

    // Seed necessary data
    $this->world = World::create(['name' => 'Test World', 'description' => 'Desc']);
});

test('it rejects malicious file types (SVG) for location image', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create a valid SVG file
    $content = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>';
    $path = sys_get_temp_dir() . '/malicious_loc.svg';
    file_put_contents($path, $content);

    $file = new UploadedFile($path, 'malicious_loc.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});

test('it accepts valid image types (JPG) for location image', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $file = UploadedFile::fake()->image('test_loc.jpg');

    $response = $this->actingAs($admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasNoErrors();
});
