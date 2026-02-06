<?php

namespace Tests\Feature\Admin\Security;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'Admin']);
        Storage::fake('public');
    }

    public function test_admin_cannot_upload_svg_file_in_card_creation()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
        $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
        $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

        $content = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $content);

        $response = $this->actingAs($admin)->post('/admin/cards', [
            'name' => 'Malicious Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $file,
            'world_id' => $world->id,
        ]);

        $response->assertSessionHasErrors(['illustration']);
    }

    public function test_admin_cannot_upload_svg_file_in_card_update()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // Setup models
        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
        $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
        $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

        // Create initial card
        $card = \App\Models\Card::create([
            'world_id' => $world->id,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'name' => 'Original Card',
            'effect' => 'Original Effect',
            'cost' => 1,
        ]);

        $content = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $content);

        $response = $this->actingAs($admin)->put("/admin/cards/{$card->id}", [
            'name' => 'Updated Malicious Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $file,
            'world_id' => $world->id,
        ]);

        $response->assertSessionHasErrors(['illustration']);
    }

    public function test_admin_cannot_upload_svg_file_in_location_creation()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

        $content = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $content);

        $response = $this->actingAs($admin)->post('/admin/locations', [
            'world_id' => $world->id,
            'name' => 'Malicious Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors(['image']);
    }
}
