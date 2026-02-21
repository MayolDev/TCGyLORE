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

beforeEach(function () {
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);
});

test('admin cannot upload SVG to locations', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    // Create a valid SVG file
    $path = sys_get_temp_dir().'/malicious.svg';
    $svgContent = '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /><script>alert(1)</script></svg>';
    file_put_contents($path, $svgContent);
    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'A test location',
        'location_type' => 'city',
        'image' => $file,
    ]);

    // Expect validation error because SVG should be blocked (either by 'image' rule or 'mimes')
    $response->assertInvalid(['image' => 'The image field must be a file of type: jpeg, png, jpg, gif, webp.']);
});

test('admin cannot upload SVG to cards', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    $cardType = CardType::create(['name' => 'Creature', 'description' => 'A creature']);
    $rarity = Rarity::create(['name' => 'Common', 'description' => 'Common rarity']);
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Neutral alignment']);

    // Create a valid SVG file
    $path = sys_get_temp_dir().'/malicious_card.svg';
    $svgContent = '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /><script>alert(1)</script></svg>';
    file_put_contents($path, $svgContent);
    $file = new UploadedFile($path, 'malicious_card.svg', 'image/svg+xml', null, true);

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

    // Expect validation error because SVG should be blocked
    $response->assertInvalid(['illustration' => 'The illustration field must be a file of type: jpeg, png, jpg, gif, webp.']);
});
