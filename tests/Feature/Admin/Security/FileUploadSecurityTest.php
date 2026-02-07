<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $permissions = [
        'users.index',
        'users.create',
        'users.edit',
        'users.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $adminRole = Role::firstOrCreate(['name' => 'Admin']);
    $adminRole->givePermissionTo(Permission::all());
});

test('admin cannot upload svg to card creation', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description', 'color' => '#ffffff']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

    // Create a valid SVG file
    $content = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $content);
    // Manually set mime type to image/svg+xml because createWithContent might guess it or not
    // Actually createWithContent doesn't exist in some versions, let's check.
    // If not, use create and write to it.

    // Better way compatible with most versions:
    $tmpFile = tempnam(sys_get_temp_dir(), 'svg');
    file_put_contents($tmpFile, $content);
    $file = new UploadedFile(
        $tmpFile,
        'malicious.svg',
        'image/svg+xml',
        null,
        true
    );

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

    // Should fail validation
    $response->assertSessionHasErrors(['illustration']);
});

test('admin can upload png to card creation', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description', 'color' => '#ffffff']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

    $file = UploadedFile::fake()->image('safe.png');

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

    $response->assertSessionHasNoErrors();
});

test('admin cannot upload svg to location creation', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

    $content = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>';
    $tmpFile = tempnam(sys_get_temp_dir(), 'svg');
    file_put_contents($tmpFile, $content);
    $file = new UploadedFile(
        $tmpFile,
        'malicious.svg',
        'image/svg+xml',
        null,
        true
    );

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});
