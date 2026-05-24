<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::post('settings/preferred-font', function (Request $request) {

        request()->validate([
            'preferred_font' => 'required|string|max:255',
        ]);

        $user = auth()->user();
        $user->preferred_font = $request->preferred_font;
        $user->save();


        return response()->json(['message' => $user]);
    })->name('settings.changeFont');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
