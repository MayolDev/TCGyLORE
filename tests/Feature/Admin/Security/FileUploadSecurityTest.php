<?php

namespace Tests\Feature\Admin\Security;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

test('se rechazan archivos SVG en la creación de cartas', function () {
    Storage::fake('public');

    // Setup roles
    Role::firstOrCreate(['name' => 'Admin']);

    // Create admin user
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create related models required for card creation
    $world = World::create(['name' => 'Test World', 'description' => 'Test Description', 'is_active' => true]);
    $cardType = CardType::create(['name' => 'Test Type', 'slug' => 'test-type']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'slug' => 'test-rarity']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'slug' => 'test-alignment']);

    // Create a fake SVG file containing potential XSS
    $svgContent = '<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
  <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
  <script type="text/javascript">
    alert("XSS");
  </script>
</svg>';

    // We need to use a real file content to properly test mimetype validation
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $world->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'illustration' => $file,
    ]);

    // Expect validation error on 'illustration' field
    $response->assertSessionHasErrors(['illustration']);
});

test('se rechazan archivos SVG en la creación de ubicaciones', function () {
    Storage::fake('public');

    // Setup roles
    Role::firstOrCreate(['name' => 'Admin']);

    // Create admin user
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create related models
    $world = World::create(['name' => 'Test World Location', 'description' => 'Test Description', 'is_active' => true]);

    // Create a fake SVG file
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious_location.svg', $svgContent);

    $response = $this->actingAs($admin)->post('/admin/locations', [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city', // Valid type from controller validation
        'image' => $file,
    ]);

    // Expect validation error on 'image' field
    $response->assertSessionHasErrors(['image']);
});
