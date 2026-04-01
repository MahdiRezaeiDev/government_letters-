<?php

use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\LetterController;
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
});

require __DIR__.'/settings.php';
