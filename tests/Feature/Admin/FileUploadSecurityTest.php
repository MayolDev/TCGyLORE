<?php

namespace Tests\Feature\Admin;

use App\Models\Alignment;
use App\Models\Archetype;
use App\Models\Artist;
use App\Models\CardType;
use App\Models\Edition;
use App\Models\Faction;
use App\Models\Rarity;
use App\Models\User;
use App\Models\World;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class FileUploadSecurityTest extends \Tests\TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

        // Crear rol admin si no existe
        if (!Role::where('name', 'Admin')->exists()) {
            Role::create(['name' => 'Admin']);
        }
    }

    public function test_admin_cannot_upload_svg_to_cards()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test Description',
            'is_active' => true,
        ]);

        // Crear dependencias necesarias para Card
        $cardType = CardType::create(['name' => 'Test Type', 'slug' => 'test-type', 'description' => 'desc']);
        $rarity = Rarity::create(['name' => 'Common', 'slug' => 'common', 'color' => '#ffffff']);
        $alignment = Alignment::create(['name' => 'Neutral', 'slug' => 'neutral', 'description' => 'desc']);

        // Crear un archivo SVG falso
        $svgContent = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"><script type="text/javascript">alert("XSS");</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'illustration' => $file,
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
        ]);

        // Debe fallar la validación
        $response->assertSessionHasErrors(['illustration']);
    }

    public function test_admin_can_upload_valid_image_to_cards()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test Description',
            'is_active' => true,
        ]);

        // Crear dependencias necesarias para Card
        $cardType = CardType::create(['name' => 'Test Type', 'slug' => 'test-type', 'description' => 'desc']);
        $rarity = Rarity::create(['name' => 'Common', 'slug' => 'common', 'color' => '#ffffff']);
        $alignment = Alignment::create(['name' => 'Neutral', 'slug' => 'neutral', 'description' => 'desc']);

        $file = UploadedFile::fake()->image('card.jpg');

        $response = $this->actingAs($admin)->post(route('admin.cards.store'), [
            'world_id' => $world->id,
            'name' => 'Test Card',
            'illustration' => $file,
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'alignment_id' => $alignment->id,
        ]);

        $response->assertSessionHasNoErrors();
        // Verificar redirección exitosa
        $response->assertRedirect(route('admin.cards.index'));
    }

    public function test_admin_cannot_upload_svg_to_locations()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test Description',
            'is_active' => true,
        ]);

        // Crear un archivo SVG falso
        $svgContent = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"><script type="text/javascript">alert("XSS");</script></svg>';
        $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        // Debe fallar la validación
        $response->assertSessionHasErrors(['image']);
    }

    public function test_admin_can_upload_valid_image_to_locations()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'Test Description',
            'is_active' => true,
        ]);

        $file = UploadedFile::fake()->image('location.png');

        $response = $this->actingAs($admin)->post(route('admin.locations.store'), [
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasNoErrors();
        // Verificar redirección exitosa
        $response->assertRedirect(route('admin.locations.index'));
    }
}
