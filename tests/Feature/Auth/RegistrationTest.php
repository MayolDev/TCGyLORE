<?php

test('registration screen can be rendered', function () {
    if (! file_exists(resource_path('js/pages/auth/register.tsx'))) {
        $this->markTestSkipped('Registration component is missing.');
    }

    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
