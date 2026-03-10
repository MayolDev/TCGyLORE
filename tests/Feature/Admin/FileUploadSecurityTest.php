<?php

namespace Tests\Feature\Admin;

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
        $this->withoutVite();
    }

    public function test_admin_locations_store_rejects_svg_uploads()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $admin->assignRole($adminRole);

        $world = World::create([
            'name' => 'Test World',
            'description' => 'A test world',
            'status' => 'active'
        ]);

        // Creamos un archivo SVG que simula ser una imagen
        $svgFile = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        // Debería fallar la validación por el tipo de archivo (mimes)
        $response->assertSessionHasErrors('image');
        $this->assertStringContainsString('The image field must be ', session('errors')->first('image'));
    }

    public function test_admin_cards_store_rejects_svg_uploads()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $admin->assignRole($adminRole);

        $world = World::create([
            'name' => 'Test World',
            'description' => 'A test world',
            'status' => 'active'
        ]);
        $cardType = \App\Models\CardType::create([
            'name' => 'Test Card Type',
            'description' => 'A test card type'
        ]);
        $rarity = \App\Models\Rarity::create([
            'name' => 'Test Rarity',
            'color' => '#ffffff',
            'icon' => 'test-icon'
        ]);
        $alignment = \App\Models\Alignment::create([
            'name' => 'Test Alignment',
            'description' => 'A test alignment'
        ]);

        // Creamos un archivo SVG que simula ser una imagen
        $svgFile = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'effect' => 'A test effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $svgFile,
        ]);

        // Debería fallar la validación por el tipo de archivo (mimes)
        $response->assertSessionHasErrors('illustration');
        $this->assertStringContainsString('The illustration field must be ', session('errors')->first('illustration'));
    }
}
