<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create roles
    Role::firstOrCreate(['name' => 'Admin']);
});

test('admin cannot upload svg file as card illustration', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create dependencies
    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true
    ]);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

    // Create malicious SVG
    $file = UploadedFile::fake()->image('malicious.svg');

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $world->id,
        'name' => 'Malicious Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
    ]);

    // Should fail validation because we want to ban SVGs
    $response->assertSessionHasErrors(['illustration']);
});

test('admin can upload valid image file as card illustration', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create dependencies
    $world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true
    ]);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
    $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

    // Create valid PNG
    $file = UploadedFile::fake()->image('valid.png');

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $world->id,
        'name' => 'Valid Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
    ]);

    // Should succeed
    $response->assertSessionHasNoErrors();
    $response->assertRedirect('/admin/cards');
});
