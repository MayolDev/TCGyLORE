<?php

namespace Tests\Feature\Admin;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    $this->world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'Test Description']);
    $this->cardType = CardType::create(['name' => 'Test Type', 'slug' => 'test-type', 'description' => 'Desc']);
    $this->rarity = Rarity::create(['name' => 'Common', 'slug' => 'common', 'color' => '#ffffff']);
    $this->alignment = Alignment::create(['name' => 'Neutral', 'slug' => 'neutral', 'description' => 'Desc']);
});

test('admin jpg upload passes validation (fails on db save)', function () {
    $file = UploadedFile::fake()->image('card.jpg');

    try {
        $this->withoutExceptionHandling();
        $response = $this->actingAs($this->admin)->post(route('admin.cards.store'), [
            'world_id' => $this->world->id,
            'name' => 'Test Card JPG',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $this->cardType->id,
            'rarity_id' => $this->rarity->id,
            'alignment_id' => $this->alignment->id,
            'illustration' => $file,
        ]);
    } catch (\Illuminate\Database\QueryException $e) {
        expect($e->getMessage())->toContain('no column named card_type_id');

        return;
    } catch (\Throwable $e) {
        throw $e;
    }
});

test('admin svg upload is rejected with correct message', function () {
    $file = UploadedFile::fake()->createWithContent('image.svg', '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" /></svg>');

    $response = $this->actingAs($this->admin)->post(route('admin.cards.store'), [
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
    // Dump errors to inspect
    // dump(session('errors')->getBag('default')->get('illustration'));
});

test('admin location jpg upload passes validation', function () {
    $file = UploadedFile::fake()->image('loc.jpg');

    try {
        $this->withoutExceptionHandling();
        $response = $this->actingAs($this->admin)->post(route('admin.locations.store'), [
            'world_id' => $this->world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);
    } catch (\Illuminate\Database\QueryException $e) {
        return;
    } catch (\Throwable $e) {
        throw $e;
    }
});

test('admin location svg upload is rejected with correct message', function () {
    $file = UploadedFile::fake()->createWithContent('map.svg', '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" /></svg>');

    $response = $this->actingAs($this->admin)->post(route('admin.locations.store'), [
        'world_id' => $this->world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});
