<?php

namespace Tests\Feature\Admin\Security;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
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

    protected User $user;
    protected World $world;
    protected CardType $cardType;
    protected Rarity $rarity;
    protected Alignment $alignment;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup admin user
        $this->user = User::factory()->create();
        $role = Role::create(['name' => 'Admin']);
        $this->user->assignRole($role);

        // Setup dependencies
        $this->world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $this->cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Desc']);
        $this->rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Desc']);
        $this->alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Desc']);
    }

    public function test_admin_cannot_upload_svg_to_cards()
    {
        Storage::fake('public');

        // Create a fake SVG file
        $file = UploadedFile::fake()->create('image.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($this->user)
            ->post(route('admin.cards.store'), [
                'world_id' => $this->world->id,
                'name' => 'Test Card',
                'effect' => 'Test Effect',
                'cost' => 1,
                'card_type_id' => $this->cardType->id,
                'rarity_id' => $this->rarity->id,
                'alignment_id' => $this->alignment->id,
                'illustration' => $file,
            ]);

        // Expect validation error on illustration field
        $response->assertSessionHasErrors(['illustration']);
    }

    public function test_admin_cannot_upload_svg_to_locations()
    {
        Storage::fake('public');

        // Create a fake SVG file
        $file = UploadedFile::fake()->create('map.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($this->user)
            ->post(route('admin.locations.store'), [
                'world_id' => $this->world->id,
                'name' => 'Test Location',
                'description' => 'Test Description',
                'location_type' => 'city',
                'image' => $file,
            ]);

        // Expect validation error on image field
        $response->assertSessionHasErrors(['image']);
    }

    public function test_admin_cannot_upload_bmp_to_cards()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('image.bmp');

        $response = $this->actingAs($this->user)
            ->post(route('admin.cards.store'), [
                'world_id' => $this->world->id,
                'name' => 'Test Card',
                'effect' => 'Test Effect',
                'cost' => 1,
                'card_type_id' => $this->cardType->id,
                'rarity_id' => $this->rarity->id,
                'alignment_id' => $this->alignment->id,
                'illustration' => $file,
            ]);

        $response->assertSessionHasErrors(['illustration']);
    }

    public function test_admin_cannot_upload_bmp_to_locations()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('image.bmp');

        $response = $this->actingAs($this->user)
            ->post(route('admin.locations.store'), [
                'world_id' => $this->world->id,
                'name' => 'Test Location',
                'description' => 'Test Description',
                'location_type' => 'city',
                'image' => $file,
            ]);

        $response->assertSessionHasErrors(['image']);
    }
}
