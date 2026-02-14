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
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);
});

test('admin cannot upload svg to card creation', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
    $cardType = CardType::create(['name' => 'Test Type']);
    $rarity = Rarity::create(['name' => 'Test Rarity']);
    $alignment = Alignment::create(['name' => 'Test Alignment']);

    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    $path = sys_get_temp_dir() . '/malicious.svg';
    file_put_contents($path, $svgContent);

    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post('/admin/cards', [
        'world_id' => $world->id,
        'name' => 'Test Card',
        'illustration' => $file,
        'effect' => 'Test Effect',
        'cost' => 1,
        'card_type_id' => $cardType->id,
        'rarity_id' => $rarity->id,
        'alignment_id' => $alignment->id,
    ]);

    $response->assertSessionHasErrors(['illustration']);
});

test('admin cannot upload svg to location creation', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    $path = sys_get_temp_dir() . '/malicious_loc.svg';
    file_put_contents($path, $svgContent);

    $file = new UploadedFile($path, 'malicious_loc.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post('/admin/locations', [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});
