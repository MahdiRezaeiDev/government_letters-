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
        $validated = $request->validate([
            'preferred_font' => 'required|string|in:Vazirmatn,Sahel,DroidArabicKufi,IranNastaliq',
        ]);

        $user = $request->user();
        $user->forceFill([
            'preferred_font' => $validated['preferred_font'],
        ])->save();

        return response()->json([
            'message' => 'فونت ذخیره شد',
            'preferred_font' => $user->preferred_font,
        ]);
    })->name('settings.changeFont');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
