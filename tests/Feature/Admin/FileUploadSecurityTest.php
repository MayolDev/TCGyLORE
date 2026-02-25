<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Storage::fake('public');
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('admin cannot upload svg file to locations', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    $svgContent = '<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
   <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
   <script type="text/javascript">
      alert("XSS");
   </script>
</svg>';

    // Create a temporary file to hold the SVG content
    $path = sys_get_temp_dir().'/malicious.svg';
    file_put_contents($path, $svgContent);

    // Create an UploadedFile instance from the temporary file
    $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

    $response = $this->actingAs($admin)->post('/admin/locations', [
        'world_id' => $world->id,
        'name' => 'Test Location',
        'description' => 'Test Description',
        'location_type' => 'city',
        'image' => $file,
    ]);

    // Expect a validation error because we want to FORBID svg
    // Currently, it might pass, so we expect this assertion to fail initially if the code is vulnerable
    $response->assertSessionHasErrors(['image']);

});

test('admin cannot upload svg file to cards', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $world = World::create([
        'name' => 'Test World',
        'description' => 'A test world',
        'is_active' => true,
    ]);

    // Create necessary dependencies for Card
    $cardType = \App\Models\CardType::create(['name' => 'Test Type', 'description' => 'desc']);
    $rarity = \App\Models\Rarity::create(['name' => 'Common', 'description' => 'desc']);
    $alignment = \App\Models\Alignment::create(['name' => 'Neutral', 'description' => 'desc']);

    $svgContent = '<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
   <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
   <script type="text/javascript">
      alert("XSS");
   </script>
</svg>';

    $path = sys_get_temp_dir().'/malicious_card.svg';
    file_put_contents($path, $svgContent);
    $file = new UploadedFile($path, 'malicious_card.svg', 'image/svg+xml', null, true);

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

    $response->assertSessionHasErrors(['illustration']);
});
