<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class LocationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure roles exist
        Role::firstOrCreate(['name' => 'Admin']);
        Storage::fake('public');
    }

    public function test_admin_can_upload_valid_image_for_location()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'Test']);

        $file = UploadedFile::fake()->image('location.jpg');

        $response = $this->actingAs($user)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.locations.index'));

        // Verify file stored
        $this->assertDatabaseHas('locations', [
            'name' => 'Test Location',
        ]);
    }

    public function test_admin_cannot_upload_svg_for_location()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'Test']);

        // Create a fake SVG file
        $file = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($user)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Malicious Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors(['image']);
    }
}
