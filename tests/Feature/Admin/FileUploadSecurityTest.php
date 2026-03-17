<?php

namespace Tests\Feature\Admin;

use App\Models\Alignment;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();

        if (! Schema::hasColumn('cards', 'character_id')) {
            Schema::table('cards', function ($table) {
                $table->foreignId('character_id')->nullable();
                $table->foreignId('rarity_id')->nullable();
                $table->foreignId('card_type_id')->nullable();
                $table->foreignId('alignment_id')->nullable();
            });
        }
    }

    public function test_admin_locations_store_rejects_svg_uploads()
    {
        $admin = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Admin']);
        $admin->assignRole($role);

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

        $svgFile = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors('image');
        $this->assertStringContainsString('The image field must be ', session('errors')->first('image'));
    }

    public function test_admin_cards_store_rejects_svg_uploads()
    {
        $admin = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Admin']);
        $admin->assignRole($role);

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $cardType = CardType::create(['name' => 'Test Type', 'description' => 'Test Description']);
        $rarity = Rarity::create(['name' => 'Test Rarity', 'description' => 'Test Description']);
        $alignment = Alignment::create(['name' => 'Test Alignment', 'description' => 'Test Description']);

        $svgFile = UploadedFile::fake()->create('malicious.svg', 10, 'image/svg+xml');

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'effect' => 'Test effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors('illustration');
    }
}
