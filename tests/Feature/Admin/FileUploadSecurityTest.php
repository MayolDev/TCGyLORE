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
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_svg_upload_is_rejected_in_card_creation()
    {
        // Setup admin user
        Role::firstOrCreate(['name' => 'Admin']);
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // Setup dependencies
        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Desc']);
        $rarity = Rarity::create(['name' => 'Common', 'description' => 'Desc']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

        // Create malicious SVG file
        $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
        $tempFile = tempnam(sys_get_temp_dir(), 'test_svg');
        file_put_contents($tempFile, $svgContent);

        $file = new UploadedFile(
            $tempFile,
            'malicious.svg',
            'image/svg+xml',
            null,
            true
        );

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

        // Expect validation error because SVG should be rejected
        $response->assertSessionHasErrors(['illustration' => 'The illustration field must be a file of type: jpeg, png, jpg, gif, webp.']);
    }

    public function test_svg_upload_is_rejected_in_location_creation()
    {
        // Setup admin user
        Role::firstOrCreate(['name' => 'Admin']);
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // Setup dependencies
        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);

        // Create malicious SVG file
        $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
        $tempFile = tempnam(sys_get_temp_dir(), 'test_svg_loc');
        file_put_contents($tempFile, $svgContent);

        $file = new UploadedFile(
            $tempFile,
            'malicious.svg',
            'image/svg+xml',
            null,
            true
        );

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        // Expect validation error because SVG should be rejected
        $response->assertSessionHasErrors(['image' => 'The image field must be a file of type: jpeg, png, jpg, gif, webp.']);
    }
}
