<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use App\Models\Location;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);
});

test('admin cannot upload restricted image types (BMP) for card illustration', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Desc']);
    $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Desc']);
    $rarity = Rarity::create(['name' => 'Common', 'color' => '#000']);
    $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

    // Create a temporary file with BMP content (fake)
    $file = UploadedFile::fake()->create('image.bmp', 100, 'image/bmp');

    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 1,
        'illustration' => $file,
    ]);

    // Should fail because BMP is not in the allow list
    $response->assertSessionHasErrors(['illustration']);
});
