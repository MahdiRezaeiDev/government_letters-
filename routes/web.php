<?php

use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\CartableController;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LetterCategoryController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Symfony\Component\HttpFoundation\Request;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->middleware(['role:super-admin'])->group(function () {
        Route::resource('organizations', OrganizationController::class);
        Route::post('organizations/{organization}/toggle-status', [OrganizationController::class, 'toggleStatus'])
            ->name('organizations.toggle-status');
        Route::get('organizations-list', [OrganizationController::class, 'getList'])
            ->name('organizations.list');
    });

    // routes/web.php

    Route::get('/organizations/departments', function (Request $request) {
        $departments = Department::where('organization_id', $request->organization_id)
            ->where('status', 'active')
            ->get(['id', 'name', 'parent_id']);
        return response()->json(['departments' => $departments]);
    })->name('organizations.departments');

    Route::get('/departments/positions', function (Request $request) {
        $positions = Position::where('department_id', $request->department_id)
            ->get(['id', 'name']);
        return response()->json(['positions' => $positions]);
    })->name('departments.positions');


    // مدیریت دپارتمان‌ها
    Route::post('departments/{department}/toggle-status', [DepartmentController::class, 'toggleStatus'])
        ->name('departments.toggle-status');
    Route::get('departments-list', [DepartmentController::class, 'getList'])
        ->name('departments.list');
    Route::resource('departments', DepartmentController::class);


    // مدیریت سمت‌ها
    Route::resource('positions', PositionController::class);
    Route::get('positions-list', [PositionController::class, 'getList'])
        ->name('positions.list');
    Route::get('positions-management-list', [PositionController::class, 'getManagementList'])
        ->name('positions.management-list');


    // مدیریت کاربران
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->name('users.assign-role');
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
        ->name('users.toggle-status');

    // API endpoints برای فرم‌ها
    Route::get('users/departments-by-organization', [UserController::class, 'getDepartmentsByOrganization'])
        ->name('users.departments-by-organization');
    Route::get('users/positions-by-department', [UserController::class, 'getPositionsByDepartment'])
        ->name('users.positions-by-department');
    Route::resource('users', UserController::class);


    // مدیریت نامه‌ها
    Route::resource('letters', LetterController::class);
    Route::post('letters/{letter}/publish', [LetterController::class, 'publish'])
        ->name('letters.publish');

    Route::get('/attachments/{attachment}/download', [LetterController::class, 'downloadAttachment'])
        ->name('attachments.download');

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

    // گزارشات
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('reports.export-excel');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');

    // کارتابل
    Route::get('/cartable', [CartableController::class, 'index'])->name('cartable.index');
    Route::post('/cartable/{routing}/complete', [CartableController::class, 'complete'])->name('cartable.complete');
    Route::post('/cartable/{routing}/reject', [CartableController::class, 'reject'])->name('cartable.reject');

    // مدیریت دسته‌بندی نامه‌ها
    Route::get('categories-list', [LetterCategoryController::class, 'getList'])
        ->name('categories.list');
    Route::post('categories/{category}/toggle-status', [LetterCategoryController::class, 'toggleStatus'])
        ->name('categories.toggle-status');
    Route::resource('categories', LetterCategoryController::class);



    // تنظیمات سیستم
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
});

require __DIR__ . '/settings.php';
