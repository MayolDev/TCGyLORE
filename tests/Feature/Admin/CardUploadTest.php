<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

test('admin cannot upload svg card illustration (security fix verification)', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    Role::firstOrCreate(['name' => 'Admin']);
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
    $cardType = CardType::create(['name' => 'Test Type']);
    $rarity = Rarity::create(['name' => 'Test Rarity', 'color' => '#000000']);
    $alignment = Alignment::create(['name' => 'Test Alignment']);

    $file = UploadedFile::fake()->create('image.svg', 100, 'image/svg+xml');

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

    // After fix: This should fail validation for 'illustration'
    $response->assertSessionHasErrors(['illustration']);
});
