<?php

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create roles
    Role::firstOrCreate(['name' => 'Admin']);

    // Seed necessary data
    $this->world = World::create(['name' => 'Test World', 'description' => 'Desc']);
    $this->cardType = CardType::create(['name' => 'Test Type', 'slug' => 'test-type', 'description' => 'Desc']);
    $this->rarity = Rarity::create(['name' => 'Test Rarity', 'slug' => 'test-rarity', 'color' => '#000000']);
    $this->alignment = Alignment::create(['name' => 'Test Alignment', 'slug' => 'test-alignment', 'description' => 'Desc']);
});

test('it rejects malicious file types (SVG)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create a valid SVG file
    $content = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>';
    $path = sys_get_temp_dir() . '/malicious.svg';
    file_put_contents($path, $content);

    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
        'illustration' => $file,
    ]);

    $response->assertSessionHasErrors(['illustration']);
});

test('it accepts valid image types (JPG)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $file = UploadedFile::fake()->image('test.jpg');

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
        'illustration' => $file,
    ]);

    $response->assertSessionHasNoErrors();
});
