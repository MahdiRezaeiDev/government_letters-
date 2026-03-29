<?php

use App\Http\Controllers\{
    LetterController,
    CartableController,
    RoutingController,
    DepartmentController,
    OrganizationController,
    PositionController,
    ArchiveController,
    ReportController,
    AnnouncementController,
    UserController,
};
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // ─── Dashboard / Cartable ────────────────────────────────────
    Route::get('/', [CartableController::class, 'index'])->name('cartable');
    Route::post('/cartable/{routing}/complete', [CartableController::class, 'complete'])->name('cartable.complete');
    Route::post('/cartable/{routing}/reject',   [CartableController::class, 'reject'])->name('cartable.reject');

    // ─── Letters ─────────────────────────────────────────────────
    Route::resource('letters', LetterController::class);
    Route::post('letters/{letter}/routings',         [RoutingController::class, 'store'])->name('letters.routings.store');
    Route::get('letters/{letter}/routing-history',   [RoutingController::class, 'history'])->name('letters.routing-history');

    // ─── Organization Structure ───────────────────────────────────
    Route::resource('organizations', OrganizationController::class);
    Route::resource('departments',   DepartmentController::class);
    Route::resource('positions',     PositionController::class);
    Route::resource('users',         UserController::class);

    // ─── Archive ─────────────────────────────────────────────────
    Route::resource('archives', ArchiveController::class);
    Route::post('archives/{archive}/files',              [ArchiveController::class, 'storeFile'])->name('archives.files.store');
    Route::post('archives/files/{file}/attach-letter',   [ArchiveController::class, 'attachLetter'])->name('archives.attach-letter');

    // ─── Reports ─────────────────────────────────────────────────
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/',          [ReportController::class, 'index'])->name('index');
        Route::get('/monthly',   [ReportController::class, 'monthly'])->name('monthly');
        Route::get('/users',     [ReportController::class, 'users'])->name('users');
        Route::get('/export',    [ReportController::class, 'export'])->name('export');
    });

    // ─── Announcements ───────────────────────────────────────────
    Route::resource('announcements', AnnouncementController::class);
    Route::post('announcements/{announcement}/publish', [AnnouncementController::class, 'publish'])->name('announcements.publish');

});