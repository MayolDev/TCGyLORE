<?php

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create Admin role
    Role::firstOrCreate(['name' => 'Admin']);
});

test('admin locations store rejects svg uploads', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'A test world']);

    $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

    $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'A test location',
        'location_type' => 'city',
        'image' => $svgFile,
    ]);

    $response->assertSessionHasErrors('image');
});

test('admin cards store rejects svg uploads', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'A test world']);
    $cardType = CardType::create(['name' => 'Test Card Type']);
    $rarity = Rarity::create(['name' => 'Test Rarity']);
    $alignment = Alignment::create(['name' => 'Test Alignment']);

    $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

    $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
        'world_id' => $world->id,
        'name' => 'Test Card',
        'effect' => 'Test effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'illustration' => $svgFile,
    ]);

    $response->assertSessionHasErrors('illustration');
});
