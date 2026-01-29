<?php

namespace Tests\Feature\Admin;

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

class CardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure roles exist
        Role::firstOrCreate(['name' => 'Admin']);
        Storage::fake('public');
    }

    public function test_admin_cannot_upload_svg_for_card()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'slug' => 'test-world', 'description' => 'Test']);
        $cardType = CardType::create(['name' => 'Test Type', 'slug' => 'test-type', 'description' => 'Test']);
        $rarity = Rarity::create(['name' => 'Test Rarity', 'slug' => 'test-rarity', 'description' => 'Test', 'color' => '#000000']);
        $alignment = Alignment::create(['name' => 'Test Alignment', 'slug' => 'test-alignment', 'description' => 'Test']);

        // Create a fake SVG file
        $file = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($user)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Malicious Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $file,
        ]);

        $response->assertSessionHasErrors(['illustration']);
    }
}
