<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Crear roles
    Role::firstOrCreate(['name' => 'Admin']);
    Role::firstOrCreate(['name' => 'Usuario']);
});

test('los usuarios no autenticados no pueden acceder al panel de administración', function () {
    $response = $this->get('/admin/users');

    $response->assertRedirect('/login');
});

test('los usuarios sin rol admin no pueden acceder al panel de administración', function () {
    $user = User::factory()->create();
    $user->assignRole('Usuario');

    $response = $this->actingAs($user)->get('/admin/users');

    $response->assertForbidden();
});

test('los administradores pueden ver la lista de usuarios', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertOk();
});

test('los administradores pueden crear usuarios', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $response = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'role' => 'Usuario',
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
    ]);
});

test('los administradores pueden actualizar usuarios', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $user = User::factory()->create();
    $user->assignRole('Usuario');

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}", [
        'name' => 'Updated Name',
        'email' => $user->email,
        'role' => 'Usuario',
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

test('los administradores pueden eliminar usuarios', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/users/{$user->id}");

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('los administradores no pueden eliminar su propio usuario', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Admin');

    $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

    $response->assertSessionHas('error');
    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
    ]);
});
