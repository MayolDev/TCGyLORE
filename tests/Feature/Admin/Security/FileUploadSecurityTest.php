<?php

namespace Tests\Feature\Admin\Security;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Storage::fake('public');
    // Create roles if they don't exist
    if (!Role::where('name', 'Admin')->exists()) {
        Role::create(['name' => 'Admin']);
    }
});

test('admin can upload valid image to location', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    $file = UploadedFile::fake()->image('location.jpg');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'coordinate_x' => 10,
        'coordinate_y' => 10,
        'image' => $file,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
});

test('admin cannot upload svg to location', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    // Create a real SVG file
    $content = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/><script>alert(1)</script></svg>';
    $path = sys_get_temp_dir() . '/malicious_loc.svg';
    file_put_contents($path, $content);
    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'coordinate_x' => 10,
        'coordinate_y' => 10,
        'image' => $file,
    ]);

    // This assertion should FAIL if the vulnerability exists (because it allows SVG)
    // We expect the error to be about file type (mimes), not just "must be an image".
    $response->assertSessionHasErrors(['image']);
    $errors = $response->getSession()->get('errors')->getBag('default');
    $messages = $errors->get('image');

    // We want to ensure we are hitting the mimes rule, not the image rule (or that mimes rule catches it first/too)
    // Current error is "The image field must be an image."
    // Expected error after fix: "The image field must be a file of type: jpeg, png, jpg, gif, webp."
    if (!str_contains($messages[0], 'type: jpeg, png')) {
        $this->fail('Expected mimes error, got: ' . $messages[0]);
    }
});

test('admin cannot upload svg to card', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

    // Create a real SVG file
    $content = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/><script>alert(1)</script></svg>';
    $path = sys_get_temp_dir() . '/malicious_card.svg';
    file_put_contents($path, $content);
    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'illustration' => $file,
    ]);

    // This assertion should FAIL if the vulnerability exists
    $response->assertSessionHasErrors(['illustration']);
    $errors = $response->getSession()->get('errors')->getBag('default');
    $messages = $errors->get('illustration');

    if (!str_contains($messages[0], 'type: jpeg, png')) {
        $this->fail('Expected mimes error, got: ' . $messages[0]);
    }
});
