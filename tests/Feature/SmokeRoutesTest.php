<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $this->user = User::where('email', 'superadmin@system.com')->firstOrFail();
});

test('super admin can open core pages', function (string $path) {
    $this->actingAs($this->user)
        ->get($path)
        ->assertSuccessful();
})->with([
    '/dashboard',
    '/letters',
    '/letters/create',
    '/cartable',
    '/archives',
    '/departments',
    '/positions',
    '/users',
    '/users/create',
    '/reports',
    '/tazkira',
    '/tazkira/create',
    '/tazkira/search',
    '/admin/organizations',
    '/admin/organizations/create',
    '/admin/letters-dashboard',
    '/settings/profile',
    '/settings',
    '/notifications',
    '/delegations/incoming',
    '/delegations/outgoing',
]);

test('security settings redirects to password confirmation when required', function () {
    $this->actingAs($this->user)
        ->get('/settings/security')
        ->assertRedirect();
});
