<?php

use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\OrganizationController;
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
use App\Models\Position;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Symfony\Component\HttpFoundation\Request;

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

    Route::get('api/organizations/{organization}/departments',
        fn(\App\Models\Organization $organization) =>
            $organization->departments()
                         ->where('status', 'active')
                         ->get(['id', 'name', 'parent_id'])
    )->name('api.org.departments');

    // دریافت سمت‌های یه واحد
    Route::get('api/departments/{department}/positions',
        fn(\App\Models\Department $department) =>
            $department->positions()
                       ->get(['id', 'name', 'level'])
    )->name('api.dept.positions');


   // جستجوی کاربر — فرمت مناسب برای SearchSelect
Route::get('api/users/search', function (Request $request) {
    $orgId = auth()->user()->organization_id;
    $query = $request->get('q', '');

    return User::where('organization_id', $orgId)
        ->where('status', 'active')
        ->where(function ($q) use ($query) {
            $q->where('first_name', 'like', "%{$query}%")
              ->orWhere('last_name',  'like', "%{$query}%")
              ->orWhere('username',   'like', "%{$query}%");
        })
        ->with('activePosition:id,name')
        ->take(10)
        ->get(['id', 'first_name', 'last_name', 'username'])
        ->map(fn($u) => [
            'id'       => $u->id,
            'label'    => "{$u->first_name} {$u->last_name}",
            'sublabel' => $u->activePosition?->name,
        ]);
})->name('api.users.search');

// جستجوی سمت
Route::get('api/positions/search', function (Request $request) {
    $orgId = auth()->user()->organization_id;
    $query = $request->get('q', '');

    return Position::whereHas('department', fn($q) =>
            $q->where('organization_id', $orgId))
        ->where('name', 'like', "%{$query}%")
        ->with('department:id,name')
        ->take(10)
        ->get(['id', 'name', 'department_id'])
        ->map(fn($p) => [
            'id'       => $p->id,
            'label'    => $p->name,
            'sublabel' => $p->department->name,
        ]);
})->name('api.positions.search');
         
});


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    
     // Users report
     Route::resource('users', UserController::class);

     // Departments Routes
     Route::resource('departments', DepartmentController::class);

     // Positions Routes
     Route::resource('positions',   PositionController::class);

     // Organizations Routes
      Route::resource('organizations', OrganizationController::class)
         ->except(['show', 'edit', 'create']);




});

require __DIR__.'/settings.php';
