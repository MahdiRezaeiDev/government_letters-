<?php

use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\UserController;
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


    // مدیریت کاربران
    Route::resource('users', UserController::class);
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->name('users.assign-role');
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
        ->name('users.toggle-status');
    
    // API endpoints برای فرم‌ها
    Route::get('users/departments-by-organization', [UserController::class, 'getDepartmentsByOrganization'])
        ->name('users.departments-by-organization');
    Route::get('users/positions-by-department', [UserController::class, 'getPositionsByDepartment'])
        ->name('users.positions-by-department');

    // مدیریت نامه‌ها
    Route::resource('letters', LetterController::class);
    Route::post('letters/{letter}/publish', [LetterController::class, 'publish'])
        ->name('letters.publish');

    // کارتابل و ارجاعات
    Route::get('cartable', [RoutingController::class, 'cartable'])->name('cartable.index');
    Route::get('letters/{letter}/routing/create', [RoutingController::class, 'create'])->name('routings.create');
    Route::post('letters/{letter}/routing', [RoutingController::class, 'store'])->name('routings.store');
    Route::post('routings/{routing}/complete', [RoutingController::class, 'complete'])->name('routings.complete');
    Route::post('routings/{routing}/reject', [RoutingController::class, 'reject'])->name('routings.reject');
    Route::get('letters/{letter}/routings-history', [RoutingController::class, 'history'])->name('routings.history');

    // بایگانی‌ها
    Route::resource('archives', ArchiveController::class);
    Route::get('archives/{archive}/permissions', [ArchiveController::class, 'permissions'])
        ->name('archives.permissions');
    
    // پرونده‌های بایگانی (نested resource)
    Route::resource('archives.cases', CaseController::class);
    Route::post('archives/{archive}/cases/{case}/attach-letter', [CaseController::class, 'attachLetter'])
        ->name('archives.cases.attach-letter');
    Route::delete('archives/{archive}/cases/{case}/detach-letter/{letter}', [CaseController::class, 'detachLetter'])
        ->name('archives.cases.detach-letter');
});

require __DIR__.'/settings.php';
