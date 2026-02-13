<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

test('svg file upload should be blocked in card creation to prevent XSS', function () {
    Storage::fake('public');

    // Create admin role if not exists
    if (!Role::where('name', 'Admin')->exists()) {
        Role::create(['name' => 'Admin']);
    }

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    // Create dependencies
    $world = World::create(['name' => 'Test World', 'description' => 'Test', 'is_active' => true]);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test']);
    $rarity = Rarity::create(['name' => 'Common', 'description' => 'Test']);
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Test']);

    // Create a minimal valid SVG file
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
    $tmpPath = sys_get_temp_dir() . '/exploit.svg';
    file_put_contents($tmpPath, $svgContent);

    $file = new UploadedFile(
        $tmpPath,
        'exploit.svg',
        'image/svg+xml',
        null,
        true
    );

    // Attempt to upload the SVG
    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'name' => 'Exploit Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
    ]);

    @unlink($tmpPath);

    // Expect validation error on 'illustration' because we want to FORBID SVGs
    $response->assertSessionHasErrors(['illustration']);
});
