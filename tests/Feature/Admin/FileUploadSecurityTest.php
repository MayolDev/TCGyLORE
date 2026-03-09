<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        // Create Admin role
        Role::firstOrCreate(['name' => 'Admin']);
    }

    public function test_admin_locations_store_rejects_svg_uploads()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'A test world',
            'is_active' => true,
        ]);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->actingAs($admin)->post('/admin/locations', [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors('image');
        $this->assertStringContainsString('The image field must be ', session('errors')->get('image')[0]);
    }

    public function test_admin_cards_store_rejects_svg_uploads()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'A test world',
            'is_active' => true,
        ]);
        $cardType = \App\Models\CardType::create([
            'name' => 'Test Type',
            'description' => 'Test Description',
        ]);
        $rarity = \App\Models\Rarity::create([
            'name' => 'Test Rarity',
            'description' => 'Test Description',
            'color_hex' => '#FFFFFF',
        ]);
        $alignment = \App\Models\Alignment::create([
            'name' => 'Test Alignment',
            'description' => 'Test Description',
        ]);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->actingAs($admin)->post('/admin/cards', [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors('illustration');
        $this->assertStringContainsString('The illustration field must be ', session('errors')->get('illustration')[0]);
    }
}
