<?php

namespace Tests\Feature\Admin\Security;

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

class FileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $world;
    protected $cardType;
    protected $rarity;
    protected $alignment;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup Admin User
        Role::firstOrCreate(['name' => 'Admin']);
        $this->user = User::factory()->withoutTwoFactor()->create();
        $this->user->assignRole('Admin');

        // Setup Dependencies
        $this->world = World::create(['name' => 'Test World', 'description' => 'Test']);
        $this->cardType = CardType::create(['name' => 'Test Type']);
        $this->rarity = Rarity::create(['name' => 'Test Rarity']);
        $this->alignment = Alignment::create(['name' => 'Test Alignment']);
    }

    public function test_card_upload_rejects_svg()
    {
        Storage::fake('public');

        $content = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="red" /></svg>';
        $path = sys_get_temp_dir() . '/malicious.svg';
        file_put_contents($path, $content);

        $file = new UploadedFile($path, 'malicious.svg', 'image/svg+xml', null, true);

        $response = $this->actingAs($this->user)->post(route('admin.cards.store'), [
            'world_id' => $this->world->id,
            'card_type_id' => $this->cardType->id,
            'rarity_id' => $this->rarity->id,
            'alignment_id' => $this->alignment->id,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'illustration' => $file,
        ]);

        $response->assertSessionHasErrors(['illustration' => 'The illustration field must be a file of type: jpeg, png, jpg, gif, webp.']);
    }

    public function test_card_upload_accepts_png()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('safe.png');

        $response = $this->actingAs($this->user)->post(route('admin.cards.store'), [
            'world_id' => $this->world->id,
            'card_type_id' => $this->cardType->id,
            'rarity_id' => $this->rarity->id,
            'alignment_id' => $this->alignment->id,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'illustration' => $file,
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_location_upload_rejects_svg()
    {
        Storage::fake('public');

        $content = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="red" /></svg>';
        $path = sys_get_temp_dir() . '/malicious_loc.svg';
        file_put_contents($path, $content);

        $file = new UploadedFile($path, 'malicious_loc.svg', 'image/svg+xml', null, true);

        $response = $this->actingAs($this->user)->post(route('admin.locations.store'), [
            'world_id' => $this->world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasErrors(['image' => 'The image field must be a file of type: jpeg, png, jpg, gif, webp.']);
    }

    public function test_location_upload_accepts_png()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('safe.png');

        $response = $this->actingAs($this->user)->post(route('admin.locations.store'), [
            'world_id' => $this->world->id,
            'name' => 'Test Location',
            'description' => 'Test Description',
            'location_type' => 'city',
            'image' => $file,
        ]);

        $response->assertSessionHasNoErrors();
    }
}
