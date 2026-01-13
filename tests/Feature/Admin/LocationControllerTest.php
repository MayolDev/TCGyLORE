<?php

namespace Tests\Feature\Admin;

use App\Models\Location;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_displays_locations_without_full_map_data()
    {
        $role = Role::firstOrCreate(['name' => 'Admin']);
        $user = User::factory()->create();
        $user->assignRole($role);
        $this->actingAs($user);

        Location::factory()->count(5)->create(['coordinate_x' => 10, 'coordinate_y' => 10]);

        $response = $this->get(route('admin.locations.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Locations/Index')
            ->has('locations')
            ->missing('allLocations') // Ensure we removed the heavy payload
        );
    }

    public function test_map_data_endpoint_returns_json()
    {
        $role = Role::firstOrCreate(['name' => 'Admin']);
        $user = User::factory()->create();
        $user->assignRole($role);
        $this->actingAs($user);

        $location = Location::factory()->create([
            'coordinate_x' => 100,
            'coordinate_y' => 200,
            'location_type' => 'city'
        ]);

        $response = $this->get(route('admin.locations.map-data'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'description', 'type', 'coordinate_x', 'coordinate_y']
            ]);
    }
}
