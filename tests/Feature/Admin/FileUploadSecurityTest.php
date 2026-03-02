<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_rejects_svg_uploads_for_locations_to_prevent_xss()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Admin']);
        $admin->assignRole($role);

        $svgContent = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><script>alert("XSS")</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent)->mimeType('image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
            'is_discovered' => false,
        ]);

        $response->assertSessionHasErrors(['image']);
    }

    public function test_rejects_svg_uploads_for_cards_to_prevent_xss()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Admin']);
        $admin->assignRole($role);

        $svgContent = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><script>alert("XSS")</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent)->mimeType('image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'world_id' => 1,
            'name' => 'Test Card',
            'illustration' => $file,
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => 1,
            'rarity_id' => 1,
            'alignment_id' => 1,
        ]);

        $response->assertSessionHasErrors(['illustration']);
    }
}
