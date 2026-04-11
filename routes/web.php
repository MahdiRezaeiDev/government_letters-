<?php

use App\Http\Controllers\OrganizationController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // مدیریت سازمان‌ها (فقط ادمین کل)
    Route::prefix('admin')->middleware(['role:super-admin'])->group(function () {
        Route::resource('organizations', OrganizationController::class);
        Route::post('organizations/{organization}/toggle-status', [OrganizationController::class, 'toggleStatus'])
            ->name('organizations.toggle-status');
        Route::get('organizations-list', [OrganizationController::class, 'getList'])
            ->name('organizations.list');
    });
});

require __DIR__.'/settings.php';
