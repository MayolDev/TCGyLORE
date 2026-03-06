<?php

namespace Tests\Feature\Admin;

use App\Models\User;
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
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $svgFile = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $world = \App\Models\World::create(['name' => 'Test World', 'description' => 'A test world']);

        $response = $this->actingAs($user)->post(route('admin.locations.store'), [
            'name' => 'Test Location',
            'world_id' => $world->id,
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors('image');
        // The error should match mimes rule
        $this->assertStringContainsString('The image field must be a file of type:', session('errors')->first('image'));
    }

    public function test_admin_cards_store_rejects_svg_uploads()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $svgFile = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $world = \App\Models\World::create(['name' => 'Test World', 'description' => 'A test world']);
        $cardType = \App\Models\CardType::create(['name' => 'Test Type', 'description' => 'A test card type']);
        $rarity = \App\Models\Rarity::create(['name' => 'Test Rarity', 'description' => 'A test rarity']);
        $alignment = \App\Models\Alignment::create(['name' => 'Test Alignment', 'description' => 'A test alignment']);

        $response = $this->actingAs($user)->post(route('admin.cards.store'), [
            'name' => 'Test Card',
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'effect' => 'Test effect',
            'cost' => 1,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors('illustration');
        $this->assertStringContainsString('The illustration field must be a file of type:', session('errors')->first('illustration'));
    }
}
