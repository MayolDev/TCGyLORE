<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        // Ensure Admin role exists
        Role::firstOrCreate(['name' => 'Admin']);
    }

    public function test_admin_locations_store_rejects_svg_uploads()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test World Description'
        ]);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors(['image']);
        $this->assertStringContainsString(
            'The image field must be a file of type: jpeg, png, jpg, gif, webp.',
            session('errors')->first('image')
        );
    }

    public function test_admin_cards_store_rejects_svg_uploads()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test World Description'
        ]);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
        $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description', 'color_code' => '#000000']);
        $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors(['illustration']);
        $this->assertStringContainsString(
            'The illustration field must be a file of type: jpeg, png, jpg, gif, webp.',
            session('errors')->first('illustration')
        );
    }
}
