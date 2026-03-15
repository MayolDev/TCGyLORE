<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Alignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Evitar fallos por Vite no encontrado
        $this->withoutVite();
    }

    public function test_svg_uploads_are_rejected_in_locations()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $user->assignRole(Role::firstOrCreate(['name' => 'Admin']));

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

        $svgFile = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($user)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors('image');
        $this->assertStringContainsString('The image field must be ', $response->getSession()->get('errors')->first('image') ?: '');
    }

    public function test_svg_uploads_are_rejected_in_cards()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $user->assignRole(Role::firstOrCreate(['name' => 'Admin']));

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $cardType = CardType::create(['name' => 'Test Type']);
        $rarity = Rarity::create(['name' => 'Test Rarity']);
        $alignment = Alignment::create(['name' => 'Test Alignment']);

        $svgFile = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($user)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors('illustration');
        $this->assertStringContainsString('The illustration field must be ', $response->getSession()->get('errors')->first('illustration') ?: '');
    }
}
