<?php

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Admin']);

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    $this->world = World::create([
        'name' => 'Test World',
        'description' => 'Test Description',
        'is_active' => true,
    ]);

    $this->cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Desc']);
    $this->rarity = Rarity::create(['name' => 'Common', 'description' => 'Test Desc']);
    $this->alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Test Desc']);
});

test('it prevents svg upload for card illustration', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->create('image.svg', 100, 'image/svg+xml');

    $response = $this->actingAs($this->admin)->post('/admin/cards', [
        'world_id' => $this->world->id,
        'name' => 'Test Card',
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $this->cardType->id,
        'rarity_id' => $this->rarity->id,
        'alignment_id' => $this->alignment->id,
        'illustration' => $file,
    ]);

    $response->assertSessionHasErrors('illustration');
});

test('it allows valid image upload for card illustration', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('image.png');

    $response = $this->actingAs($this->admin)->post('/admin/cards', [
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
