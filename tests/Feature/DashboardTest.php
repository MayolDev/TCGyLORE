<?php

use App\Models\User;

beforeEach(function () {
    $this->withoutVite();
});

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

beforeEach(function () {
    $this->withoutVite();
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});
