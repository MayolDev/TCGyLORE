<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
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
    }

    public function test_location_store_rejects_svg_upload_to_prevent_xss()
    {
        $admin = User::factory()->create();
        $admin->assignRole(Role::firstOrCreate(['name' => 'Admin']));

        $world = World::create(['name' => 'Test World', 'description' => 'A world']);

        $file = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'world_id' => $world->id,
            'image' => $file,
        ]);

        $response->assertSessionHasErrors(['image']);
        // Verify we get the specific mimes message
        $errors = session('errors')->get('image');
        $this->assertTrue(
            in_array('The image field must be a file of type: jpeg, png, jpg, gif, webp.', $errors),
            'Error message should relate to invalid file type. Instead got: ' . implode(', ', $errors)
        );
    }

    public function test_card_store_rejects_svg_upload_to_prevent_xss()
    {
        $admin = User::factory()->create();
        $admin->assignRole(Role::firstOrCreate(['name' => 'Admin']));

        $world = World::create(['name' => 'Test World', 'description' => 'A world']);
        $cardType = CardType::create(['name' => 'Test Type']);
        $rarity = Rarity::create(['name' => 'Test Rarity']);
        $alignment = Alignment::create(['name' => 'Test Alignment']);

        $file = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'world_id' => $world->id,
            'illustration' => $file,
        ]);

        $response->assertSessionHasErrors(['illustration']);
        $errors = session('errors')->get('illustration');
        $this->assertTrue(
            in_array('The illustration field must be a file of type: jpeg, png, jpg, gif, webp.', $errors),
            'Error message should relate to invalid file type. Instead got: ' . implode(', ', $errors)
        );
    }
}
