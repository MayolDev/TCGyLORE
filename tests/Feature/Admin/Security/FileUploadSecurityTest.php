<?php

namespace Tests\Feature\Admin\Security;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup roles
        Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'Usuario']);
    }

    public function test_card_creation_rejects_svg_files()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // Create dependencies
        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Desc']);
        $rarity = Rarity::create(['name' => 'Common', 'color' => '#000000']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

        // Create a fake SVG file with malicious content
        $svgContent = '<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
  <script type="text/javascript">
    alert("XSS");
  </script>
</svg>';

        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

        $response = $this->actingAs($admin)->post('/admin/cards', [
            'name' => 'Malicious Card',
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'effect' => 'Test Effect',
            'cost' => 1,
            'illustration' => $file,
        ]);

        $response->assertSessionHasErrors('illustration');
    }

    public function test_location_creation_rejects_svg_files()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);

        $svgContent = '<svg><script>alert(1)</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

        $response = $this->actingAs($admin)->post('/admin/locations', [
            'name' => 'Malicious Location',
            'world_id' => $world->id,
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors('image');
    }

    public function test_card_creation_accepts_valid_image_files()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // Create dependencies
        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Desc']);
        $rarity = Rarity::create(['name' => 'Common', 'color' => '#000000']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

        $file = UploadedFile::fake()->image('card.jpg');

        $response = $this->actingAs($admin)->post('/admin/cards', [
            'name' => 'Valid Card',
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'effect' => 'Test Effect',
            'cost' => 1,
            'illustration' => $file,
        ]);

        $response->assertSessionHasNoErrors();
    }
}
