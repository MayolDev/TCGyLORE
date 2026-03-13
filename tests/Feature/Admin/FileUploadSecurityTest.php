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

        $this->admin = User::factory()->create();
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $this->admin->assignRole($adminRole);

        $this->world = World::create(['name' => 'Test World', 'description' => 'A test world']);

        // Ensure missing foreign key columns are added temporarily to cards table for testing
        if (!Schema::hasColumn('cards', 'rarity_id')) {
            Schema::table('cards', function($table) {
                $table->integer('card_type_id')->nullable();
                $table->integer('rarity_id')->nullable();
                $table->integer('alignment_id')->nullable();
                $table->integer('archetype_id')->nullable();
                $table->integer('faction_id')->nullable();
                $table->integer('edition_id')->nullable();
                $table->integer('artist_id')->nullable();
            });
        }

        try {
            CardType::create(['name' => 'Monster']);
            Rarity::create(['name' => 'Common']);
            Alignment::create(['name' => 'Good']);
        } catch (\Exception $e) {}
    }

    public function test_location_image_upload_rejects_svg_files()
    {
        Storage::fake('public');

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script></svg>');

        $response = $this->actingAs($this->admin)->post(route('admin.locations.store'), [
            'world_id' => $this->world->id,
            'name' => 'Test Location',
            'description' => 'A test location',
            'location_type' => 'city',
            'image' => $svgFile,
        ]);

        $response->assertSessionHasErrors(['image']);
    }

    public function test_card_illustration_upload_rejects_svg_files()
    {
        Storage::fake('public');

        $svgFile = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script></svg>');

        $response = $this->actingAs($this->admin)->post(route('admin.cards.store'), [
            'world_id' => $this->world->id,
            'name' => 'Test Card',
            'effect' => 'Test effect',
            'cost' => 1,
            'card_type_id' => 1,
            'rarity_id' => 1,
            'alignment_id' => 1,
            'illustration' => $svgFile,
        ]);

        $response->assertSessionHasErrors(['illustration']);
    }
}
