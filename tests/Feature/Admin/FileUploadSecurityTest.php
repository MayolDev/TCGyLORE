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
use Illuminate\Support\Facades\Schema;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        // Ensure roles exist
        Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'User']);

        if (!Schema::hasColumn('cards', 'rarity_id')) {
            Schema::table('cards', function ($table) {
                $table->integer('rarity_id')->nullable();
                $table->integer('card_type_id')->nullable();
                $table->integer('alignment_id')->nullable();
                $table->integer('archetype_id')->nullable();
                if (!Schema::hasColumn('cards', 'character_id')) {
                    $table->integer('character_id')->nullable();
                }
                $table->integer('faction_id')->nullable();
                $table->integer('edition_id')->nullable();
                $table->integer('artist_id')->nullable();
            });
        }
    }

    public function test_location_store_rejects_svg_uploads_to_prevent_xss()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script></svg>');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors('image');

        $this->assertStringContainsString(
            'The image field must be ',
            session('errors')->get('image')[0]
        );

        Storage::disk('public')->assertMissing('locations/' . $svgFile->hashName());
    }

    public function test_card_store_rejects_svg_uploads_to_prevent_xss()
    {
        Storage::fake('public');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create(['name' => 'Test World', 'description' => 'Test Description']);
        $cardType = CardType::create(['name' => 'Test Type']);
        $rarity = Rarity::create(['name' => 'Test Rarity']);
        $alignment = Alignment::create(['name' => 'Test Alignment']);

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script></svg>');

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

        $this->assertStringContainsString(
            'The illustration field must be ',
            session('errors')->get('illustration')[0]
        );

        Storage::disk('public')->assertMissing('cards/' . $svgFile->hashName());
    }
}
