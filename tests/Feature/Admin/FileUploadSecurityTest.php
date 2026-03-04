<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_rejects_svg_uploads_for_locations()
    {
        $user = User::factory()->create();
        $user->assignRole(\Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Admin']));

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test description',
        ]);

        $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($user)->post(route('admin.locations.store'), [
            'name' => 'Test Location',
            'world_id' => $world->id,
            'description' => 'Test description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors('image');
        $this->assertEquals('The image field must be a file of type: jpeg, png, jpg, gif, webp.', session('errors')->get('image')[0]);
    }

    public function test_rejects_svg_uploads_for_cards()
    {
        $user = User::factory()->create();
        $user->assignRole(\Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Admin']));

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test description',
        ]);

        $file = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($user)->post(route('admin.cards.store'), [
            'name' => 'Test Card',
            'world_id' => $world->id,
            'effect' => 'Test effect',
            'illustration' => $file,
        ]);

        $response->assertSessionHasErrors('illustration');
        $this->assertEquals('The illustration field must be a file of type: jpeg, png, jpg, gif, webp.', session('errors')->get('illustration')[0]);
    }
}
