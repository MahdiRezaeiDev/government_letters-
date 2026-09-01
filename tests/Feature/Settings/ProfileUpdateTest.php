<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'mobile' => '0700000000',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->first_name)->toBe('Test');
    expect($user->last_name)->toBe('User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can select Pashto as their interface language', function () {
    $user = User::factory()->create([
        'locale' => 'fa',
        'preferences' => ['theme' => 'light', 'notifications' => true],
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('preferences.update'), [
            'language' => 'ps',
            'theme' => 'dark',
            'notifications' => false,
            'preferred_font' => 'Vazirmatn',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->locale)->toBe('ps')
        ->and($user->preferences['theme'])->toBe('dark')
        ->and($user->preferences['notifications'])->toBeFalse();
});

test('unsupported interface languages are rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->patch(route('preferences.update'), [
            'language' => 'invalid',
            'theme' => 'light',
            'notifications' => true,
            'preferred_font' => 'Vazirmatn',
        ]);

    $response
        ->assertSessionHasErrors('language')
        ->assertRedirect(route('profile.edit'));
});

test('saved Pashto locale is applied on subsequent requests', function () {
    $user = User::factory()->create(['locale' => 'ps']);

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response
        ->assertOk()
        ->assertSee('<html dir="rtl" lang="ps">', false);
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect(User::withTrashed()->find($user->id)?->trashed())->toBeTrue();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
