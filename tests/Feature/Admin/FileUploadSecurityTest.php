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

    // Create an admin user
    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    // Create base dependencies for models
    $this->world = World::create(['name' => 'Test World', 'description' => 'Test']);
});

test('admin locations store rejects svg uploads to prevent xss', function () {
    Storage::fake('public');

    // Create a fake SVG file containing a simple script payload
    $svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

    $response = $this->actingAs($this->admin)->post('/admin/locations', [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'A test location',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
    $this->assertStringContainsString('The image field must be ', $response->getSession()->get('errors')->first('image') ?: 'The image field must be');
});

test('admin cards store rejects svg uploads to prevent xss', function () {
    Storage::fake('public');

    // Need required dependencies for Card
    $cardType = CardType::create(['name' => 'Test Type']);
    $rarity = Rarity::create(['name' => 'Test Rarity']);
    $alignment = Alignment::create(['name' => 'Test Alignment']);

    // Create a fake SVG file containing a simple script payload
    $svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

    $response = $this->actingAs($this->admin)->post('/admin/cards', [
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'effect' => 'Test effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
        'illustration' => $file,
    ]);

    $response->assertSessionHasErrors(['illustration']);
    $this->assertStringContainsString('The illustration field must be ', $response->getSession()->get('errors')->first('illustration') ?: 'The illustration field must be');
});
