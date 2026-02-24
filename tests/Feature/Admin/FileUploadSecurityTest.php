<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Crear roles
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('admin cannot upload svg files to locations', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    // Create a fake SVG file with valid content
    $content = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>';
    $path = sys_get_temp_dir() . '/malicious.svg';
    file_put_contents($path, $content);

    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post('/admin/locations', [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    // We expect a validation error specifically on the image field
    $response->assertSessionHasErrors(['image' => 'The image field must be a file of type: jpeg, png, jpg, gif, webp.']);
});
