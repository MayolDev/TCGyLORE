<?php

namespace Tests\Feature\Admin;

use App\Models\Character;
use App\Models\Location;
use App\Models\TimelineEvent;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TimelineEventControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure Admin role exists
        if (! Role::where('name', 'Admin')->exists()) {
            Role::create(['name' => 'Admin']);
        }
    }

    public function test_index_loads_optimized_relationships()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'World Description',
            'is_active' => true,
        ]);

        $character = Character::create([
            'world_id' => $world->id,
            'name' => 'Test Character',
            'biography' => 'This is a very long biography that should not be loaded on the index page.',
            'spells' => ['fireball'],
        ]);

        $location = Location::create([
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'This is a very long description that should not be loaded on the index page.',
            'location_type' => 'ciudad',
            'coordinate_x' => 10,
            'coordinate_y' => 20,
        ]);

        $event = TimelineEvent::create([
            'world_id' => $world->id,
            'year' => 100,
            'name' => 'Test Event',
            'description' => 'Event Description',
            'event_type' => 'guerra',
            'importance' => 'crucial',
        ]);

        $event->characters()->attach($character->id);
        $event->locations()->attach($location->id);

        $response = $this->actingAs($user)->get(route('admin.timeline-events.index'));

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/TimelineEvents/Index')
            ->has('events.data.0', function (Assert $json) use ($event, $character, $location) {
                $json->where('id', $event->id)
                    ->where('name', 'Test Event')
                    ->has('characters.0', function (Assert $charJson) use ($character) {
                        $charJson->where('id', $character->id)
                            ->where('name', $character->name)
                            ->missing('biography') // Optimization check: biography should NOT be present
                            ->etc();
                    })
                    ->has('locations.0', function (Assert $locJson) use ($location) {
                        $locJson->where('id', $location->id)
                            ->where('name', $location->name)
                            ->missing('description') // Optimization check: description should NOT be present
                            ->etc();
                    })
                    ->etc();
            })
        );
    }

    public function test_edit_loads_optimized_relationships()
    {
        $user = User::factory()->create();
        $user->assignRole('Admin');

        $world = World::create([
            'name' => 'Test World',
            'description' => 'World Description',
            'is_active' => true,
        ]);

        $character = Character::create([
            'world_id' => $world->id,
            'name' => 'Test Character',
            'biography' => 'This is a very long biography that should not be loaded on the edit page.',
            'spells' => ['fireball'],
        ]);

        $location = Location::create([
            'world_id' => $world->id,
            'name' => 'Test Location',
            'description' => 'This is a very long description that should not be loaded on the edit page.',
            'location_type' => 'ciudad',
            'coordinate_x' => 10,
            'coordinate_y' => 20,
        ]);

        $event = TimelineEvent::create([
            'world_id' => $world->id,
            'year' => 100,
            'name' => 'Test Event',
            'description' => 'Event Description',
            'event_type' => 'guerra',
            'importance' => 'crucial',
        ]);

        $event->characters()->attach($character->id);
        $event->locations()->attach($location->id);

        $response = $this->actingAs($user)->get(route('admin.timeline-events.edit', $event));

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/TimelineEvents/Edit')
            ->has('event', function (Assert $json) use ($character, $location) {
                $json->has('characters.0', function (Assert $charJson) use ($character) {
                    $charJson->where('id', $character->id)
                        ->where('name', $character->name)
                        ->missing('biography') // Optimization check
                        ->etc();
                })
                    ->has('locations.0', function (Assert $locJson) use ($location) {
                        $locJson->where('id', $location->id)
                            ->where('name', $location->name)
                            ->missing('description') // Optimization check
                            ->etc();
                    })
                    ->etc();
            })
        );
    }
}
