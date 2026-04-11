<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PositionController;
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

    // مدیریت دپارتمان‌ها
    Route::resource('departments', DepartmentController::class);
    Route::post('departments/{department}/toggle-status', [DepartmentController::class, 'toggleStatus'])
        ->name('departments.toggle-status');
    Route::get('departments-list', [DepartmentController::class, 'getList'])
        ->name('departments.list');

    // مدیریت سمت‌ها
    Route::resource('positions', PositionController::class);
    Route::get('positions-list', [PositionController::class, 'getList'])
        ->name('positions.list');
    Route::get('positions-management-list', [PositionController::class, 'getManagementList'])
        ->name('positions.management-list');
});

require __DIR__.'/settings.php';
