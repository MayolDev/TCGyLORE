<?php

namespace Tests\Feature\Admin;

use App\Models\Card;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_displays_cards()
    {
        // Crear rol admin si no existe
        $role = Role::create(['name' => 'Admin']);

        $user = User::factory()->create();
        $user->assignRole($role);

        $this->actingAs($user);

        $response = $this->get(route('admin.cards.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Cards/Index')
            ->has('cards')
        );
    }
}
