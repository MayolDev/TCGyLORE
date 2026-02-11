<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use App\Models\Card;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create necessary roles
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('admin can upload valid image file (jpg)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    Storage::fake('public');

    // Create dependencies
    $world = World::create(['name' => 'Test World', 'description' => 'Desc', 'is_active' => true]);
    $cardType = CardType::create(['name' => 'Creature', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'Common', 'description' => 'Desc', 'color' => '#000']);
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

    $file = UploadedFile::fake()->image('valid.jpg');

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

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Check storage
    $card = Card::latest()->first();
    expect($card->illustration)->not->toBeNull();
    Storage::disk('public')->assertExists($card->illustration);
});

test('admin cannot upload svg file (potential XSS)', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    Storage::fake('public');

    // Create dependencies
    $world = World::create(['name' => 'Test World', 'description' => 'Desc', 'is_active' => true]);
    $cardType = CardType::create(['name' => 'Creature', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'Common', 'description' => 'Desc', 'color' => '#000']);
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

    // Manually create a valid SVG file
    $svgContent = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    $tmpFile = tempnam(sys_get_temp_dir(), 'test_svg');
    file_put_contents($tmpFile, $svgContent);

    $file = new UploadedFile(
        $tmpFile,
        'exploit.svg',
        'image/svg+xml',
        null,
        true
    );

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $world->id,
        'name' => 'Test Card SVG',
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
