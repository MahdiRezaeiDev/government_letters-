<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/', fn() => inertia('Dashboard'))->name('dashboard');

    // سازمان‌ها
    Route::resource('organizations', OrganizationController::class);

    // واحدهای سازمانی
    Route::resource('departments', DepartmentController::class);
    Route::get('organizations/{organization}/tree', [DepartmentController::class, 'tree'])
        ->name('departments.tree');

    // سمت‌ها
    Route::resource('positions', PositionController::class);

    // کاربران
    Route::resource('users', UserController::class);
    Route::post('users/{user}/assign-position', [UserController::class, 'assignPosition'])
        ->name('users.assign-position');
    Route::delete('users/{user}/positions/{position}', [UserController::class, 'removePosition'])
        ->name('users.remove-position');

    // نقش‌ها و دسترسی‌ها
    Route::resource('roles', RoleController::class);
    Route::post('roles/{role}/permissions', [RoleController::class, 'syncPermissions'])
        ->name('roles.sync-permissions');
});