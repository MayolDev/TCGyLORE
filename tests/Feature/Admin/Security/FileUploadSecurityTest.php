<?php

namespace Tests\Feature\Admin\Security;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup Admin User
        Role::firstOrCreate(['name' => 'Admin']);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('Admin');
    }

    public function test_card_illustration_rejects_svg()
    {
        // Dependencies
        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Desc']);
        $rarity = Rarity::create(['name' => 'Common', 'description' => 'Desc']);
        $alignment = Alignment::create(['name' => 'Neutral', 'description' => 'Desc']);

        $file = UploadedFile::fake()->createWithContent('malicious.svg', '<svg><script>alert(1)</script></svg>');

        $response = $this->actingAs($this->admin)->post(route('admin.cards.store'), [
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

    public function test_location_image_rejects_svg()
    {
        $world = World::create(['name' => 'Test World', 'description' => 'Desc']);

        $file = UploadedFile::fake()->createWithContent('malicious.svg', '<svg><script>alert(1)</script></svg>');

        $response = $this->actingAs($this->admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Desc',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors(['image']);
    }
}
