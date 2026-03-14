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

        // Create Admin role and user
        $role = Role::firstOrCreate(['name' => 'Admin']);
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole($role);
    }

    public function test_svg_uploads_are_rejected_in_locations()
    {
        $world = World::create(['name' => 'Test World', 'description' => 'Test']);

        $svgFile = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($this->adminUser)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors(['image' => 'The image field must be a file of type: jpeg, png, jpg, gif, webp.']);
    }

    public function test_svg_uploads_are_rejected_in_cards()
    {
        $world = World::create(['name' => 'Test World', 'description' => 'Test']);
        $cardType = \App\Models\CardType::create(['name' => 'Test Type']);
        $rarity = \App\Models\Rarity::create(['name' => 'Test Rarity']);
        $alignment = \App\Models\Alignment::create(['name' => 'Test Alignment']);

        $svgFile = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($this->adminUser)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors(['illustration' => 'The illustration field must be a file of type: jpeg, png, jpg, gif, webp.']);
    }
}