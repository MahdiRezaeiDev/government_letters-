<?php

use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\PositionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Archive\FileController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\CartableController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoutingController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Letter routes
    Route::resource('letters', LetterController::class);

    // Attachment routes
    Route::post('letters/{letter}/attachments', [AttachmentController::class, 'store'])
         ->name('attachments.store');
    Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy'])
         ->name('attachments.destroy');
    Route::get('attachments/{attachment}/download', [AttachmentController::class, 'download'])
         ->name('attachments.download');

    // Cartable route
     Route::get('cartable', [CartableController::class, 'index'])->name('cartable.index');

    // Routing routes
    Route::post('letters/{letter}/routings', [RoutingController::class, 'store'])
         ->name('routings.store');
    Route::post('routings/{routing}/action', [RoutingController::class, 'action'])
         ->name('routings.action');

     // Report route
     Route::get('reports', [ReportController::class, 'index'])
         ->name('reports.index');

     // Notification route
     Route::get('notifications',              [NotificationController::class, 'index'])
         ->name('notifications.index');
     Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount'])
         ->name('notifications.unread-count');
     Route::post('notifications/{id}/read',   [NotificationController::class, 'markAsRead'])
         ->name('notifications.read');
     Route::post('notifications/read-all',    [NotificationController::class, 'markAllAsRead'])
         ->name('notifications.read-all');

    // Archives routes
    Route::resource('archives', ArchiveController::class)
         ->except(['show', 'edit', 'create']);

    Route::get('archives/{archive}/files',
        [FileController::class, 'index'])->name('archives.files.index');

    Route::post('archives/{archive}/files',
        [FileController::class, 'store'])->name('archives.files.store');

    Route::post('files/{file}/letters',
        [FileController::class, 'attachLetter'])->name('files.letters.attach');

    Route::delete('files/{file}/letters/{letter}',
        [FileController::class, 'detachLetter'])->name('files.letters.detach');
         
});


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    
     // Users report
     Route::resource('users', UserController::class);

     // Departments Routes
     Route::resource('departments', DepartmentController::class);

     // Positions Routes
     Route::resource('positions',   PositionController::class);

});

require __DIR__.'/settings.php';
