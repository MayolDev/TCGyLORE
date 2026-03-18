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

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // This stops Vite trying to build frontend assets when running backend tests
        $this->withoutVite();

        $role = Role::firstOrCreate(['name' => 'Admin']);
        $this->admin = User::factory()->create();
        $this->admin->assignRole($role);
    }

    public function test_admin_location_store_rejects_svg_uploads()
    {
        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->actingAs($this->admin)->post(route('admin.locations.store'), [
            'name' => 'Test Location',
            'description' => 'Test Description',
            'world_id' => $world->id,
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors('image');
        $this->assertStringContainsString('The image field must be', $response->getSession()->get('errors')->first('image'));
    }

    public function test_admin_card_store_rejects_svg_uploads()
    {
        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $cardType = CardType::create(['name' => 'Creature']);
        $rarity = Rarity::create(['name' => 'Common']);
        $alignment = Alignment::create(['name' => 'Neutral']);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->actingAs($this->admin)->post(route('admin.cards.store'), [
            'name' => 'Test Card',
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'effect' => 'Test Effect',
            'cost' => 1,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors('illustration');
        $this->assertStringContainsString('The illustration field must be', $response->getSession()->get('errors')->first('illustration'));
    }
}
