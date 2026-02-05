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
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('admin cannot upload svg files to cards', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Desc', 'is_active' => true]);
    $cardType = CardType::create(['name' => 'Spell', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'Common', 'description' => 'Desc', 'color' => '#fff']);
    $alignment = Alignment::create(['name' => 'Good', 'description' => 'Desc']);

    $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

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

    $response->assertSessionHasErrors('illustration');
});

test('admin can upload jpg files to cards', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Desc', 'is_active' => true]);
    $cardType = CardType::create(['name' => 'Spell', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'Common', 'description' => 'Desc', 'color' => '#fff']);
    $alignment = Alignment::create(['name' => 'Good', 'description' => 'Desc']);

    $file = UploadedFile::fake()->image('safe.jpg');

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

    $response->assertRedirect('/admin/cards');
    $response->assertSessionHasNoErrors();
});
