<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'Admin']);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('Admin');
    }

    public function test_location_store_rejects_svg_upload()
    {
        Storage::fake('public');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test description',
            'is_active' => true,
        ]);

        $svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><script>alert(1)</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

        $response = $this->actingAs($this->admin)->post('/admin/locations', [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Location description',
            'location_type' => 'castle',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors([
            'image' => 'The image field must be a file of type: jpeg, png, jpg, gif, webp.',
        ]);

        Storage::disk('public')->assertMissing('locations/' . $file->hashName());
    }

    public function test_card_store_rejects_svg_upload()
    {
        Storage::fake('public');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test description',
            'is_active' => true,
        ]);

        $cardType = CardType::create([
            'name' => 'Hero',
            'description' => 'Hero description'
        ]);

        $rarity = Rarity::create([
            'name' => 'Common',
            'description' => 'Common rarity'
        ]);

        $alignment = Alignment::create([
            'name' => 'Good',
            'description' => 'Good alignment'
        ]);

        $svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><script>alert(1)</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

        $response = $this->actingAs($this->admin)->post('/admin/cards', [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'effect' => 'Test effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $file,
        ]);

        $response->assertSessionHasErrors([
            'illustration' => 'The illustration field must be a file of type: jpeg, png, jpg, gif, webp.',
        ]);

        Storage::disk('public')->assertMissing('cards/' . $file->hashName());
    }
}
