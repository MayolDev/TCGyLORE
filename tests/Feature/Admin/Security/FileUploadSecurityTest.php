<?php

namespace Tests\Feature\Admin\Security;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure roles exist
        Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'Usuario']);
    }

    public function test_admin_cannot_upload_svg_image_for_location()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'A test world',
            'is_active' => true,
        ]);

        // Creating a malicious SVG file with content
        $path = sys_get_temp_dir() . '/malicious_location.svg';
        file_put_contents($path, '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="red" /><script>alert(1)</script></svg>');
        $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $file,
        ]);

        // This test asserts that the 'image' field has validation errors.
        // It ensures SVGs are rejected, either by the 'image' rule itself or our explicit 'mimes' rule.
        $response->assertSessionHasErrors(['image']);
    }

    public function test_admin_cannot_upload_svg_illustration_for_card()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Card World',
            'description' => 'Test description',
            'is_active' => true,
        ]);

        $cardType = CardType::create(['name' => 'Creature', 'description' => 'desc']);
        $rarity = Rarity::create(['name' => 'Common', 'description' => 'desc']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'desc']);

        // Creating a malicious SVG file with content
        $path = sys_get_temp_dir() . '/malicious_card.svg';
        file_put_contents($path, '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="red" /><script>alert(1)</script></svg>');
        $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

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

        $response->assertSessionHasErrors(['illustration']);
    }

    public function test_admin_can_upload_valid_image_for_location()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create(['name' => 'Valid World', 'description' => 'A valid world', 'is_active' => true]);

        $file = UploadedFile::fake()->image('valid.jpg');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Valid Location',
            'description' => 'A valid location',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasNoErrors();
    }
}
