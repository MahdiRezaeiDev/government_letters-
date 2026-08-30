<?php

use App\Models\SystemSetting;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->user = User::where('email', 'superadmin@system.com')->firstOrFail();
});

test('Pashto system locale is saved and returned to the settings page', function () {
    $this->actingAs($this->user)
        ->post(route('settings.update'), ['app_locale' => 'ps'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.index'));

    expect(SystemSetting::where('key', 'app_locale')->value('value'))->toBe('ps')
        ->and($this->user->refresh()->locale)->toBe('ps');

    $this->actingAs($this->user)
        ->get(route('settings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/index')
            ->where('settings.app_locale', 'ps')
            ->where('locale', 'ps'));
});

test('stored settings are returned as a flat typed object', function () {
    SystemSetting::create([
        'organization_id' => $this->user->organization_id,
        'group' => 'security',
        'key' => 'session_lifetime',
        'value' => '180',
        'type' => 'number',
    ]);

    $this->actingAs($this->user)
        ->get(route('settings.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settings.session_lifetime', 180)
            ->has('settings.app_name')
            ->has('settings.max_file_size'));
});
