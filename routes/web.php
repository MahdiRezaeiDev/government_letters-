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

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ═══════════════════════════════════════════════════════
    // ادمین کل — مدیریت سازمان‌ها
    // ═══════════════════════════════════════════════════════
    Route::prefix('admin')->middleware(['role:super-admin'])->group(function () {
        Route::get('organizations', [OrganizationController::class, 'index'])->name('organizations.index');
        Route::get('organizations/create', [OrganizationController::class, 'create'])->name('organizations.create');
        Route::post('organizations', [OrganizationController::class, 'store'])->name('organizations.store');
        Route::get('organizations-list', [OrganizationController::class, 'getList'])->name('organizations.list');
        Route::get('organizations/{organization}', [OrganizationController::class, 'show'])->name('organizations.show');
        Route::get('organizations/{organization}/edit', [OrganizationController::class, 'edit'])->name('organizations.edit');
        Route::put('organizations/{organization}', [OrganizationController::class, 'update'])->name('organizations.update');
        Route::delete('organizations/{organization}', [OrganizationController::class, 'destroy'])->name('organizations.destroy');
        Route::post('organizations/{organization}/toggle-status', [OrganizationController::class, 'toggleStatus'])->name('organizations.toggle-status');
    });

    // ═══════════════════════════════════════════════════════
    // API Helpers — فقط auth (بدون permission)
    // ═══════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════
    // دپارتمان‌ها
    // ✅ static routes اول، بعد {parameter}
    // ═══════════════════════════════════════════════════════
    Route::get('departments', [DepartmentController::class, 'index'])
        ->middleware('permission:view-departments')->name('departments.index');
    Route::get('departments-list', [DepartmentController::class, 'getList'])
        ->middleware('permission:view-departments')->name('departments.list');
    Route::get('departments/create', [DepartmentController::class, 'create'])
        ->middleware('permission:create-department')->name('departments.create');
    Route::post('departments', [DepartmentController::class, 'store'])
        ->middleware('permission:create-department')->name('departments.store');
    Route::get('departments/{department}', [DepartmentController::class, 'show'])
        ->middleware('permission:view-departments')->name('departments.show');
    Route::get('departments/{department}/edit', [DepartmentController::class, 'edit'])
        ->middleware('permission:edit-department')->name('departments.edit');
    Route::put('departments/{department}', [DepartmentController::class, 'update'])
        ->middleware('permission:edit-department')->name('departments.update');
    Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])
        ->middleware('permission:delete-department')->name('departments.destroy');
    Route::post('departments/{department}/toggle-status', [DepartmentController::class, 'toggleStatus'])
        ->middleware('permission:edit-department')->name('departments.toggle-status');

    // ═══════════════════════════════════════════════════════
    // پست‌های سازمانی
    // ✅ static routes اول، بعد {parameter}
    // ═══════════════════════════════════════════════════════
    Route::get('positions', [PositionController::class, 'index'])
        ->middleware('permission:view-positions')->name('positions.index');
    Route::get('positions-list', [PositionController::class, 'getList'])
        ->middleware('permission:view-positions')->name('positions.list');
    Route::get('positions-management-list', [PositionController::class, 'getManagementList'])
        ->middleware('permission:view-positions')->name('positions.management-list');
    Route::get('positions/create', [PositionController::class, 'create'])
        ->middleware('permission:create-position')->name('positions.create');
    Route::post('positions', [PositionController::class, 'store'])
        ->middleware('permission:create-position')->name('positions.store');
    Route::get('positions/{position}', [PositionController::class, 'show'])
        ->middleware('permission:view-positions')->name('positions.show');
    Route::get('positions/{position}/edit', [PositionController::class, 'edit'])
        ->middleware('permission:edit-position')->name('positions.edit');
    Route::put('positions/{position}', [PositionController::class, 'update'])
        ->middleware('permission:edit-position')->name('positions.update');
    Route::delete('positions/{position}', [PositionController::class, 'destroy'])
        ->middleware('permission:delete-position')->name('positions.destroy');

    // ═══════════════════════════════════════════════════════
    // کاربران
    // ✅ static routes اول، بعد {parameter}
    // ═══════════════════════════════════════════════════════
    Route::get('users', [UserController::class, 'index'])
        ->middleware('permission:view-users')->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])
        ->middleware('permission:create-user')->name('users.create');
    Route::get('users/departments-by-organization', [UserController::class, 'getDepartmentsByOrganization'])
        ->middleware('permission:view-users')->name('users.departments-by-organization');
    Route::get('users/positions-by-department', [UserController::class, 'getPositionsByDepartment'])
        ->middleware('permission:view-users')->name('users.positions-by-department');
    Route::post('users', [UserController::class, 'store'])
        ->middleware('permission:create-user')->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])
        ->middleware('permission:view-users')->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])
        ->middleware('permission:edit-user')->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])
        ->middleware('permission:edit-user')->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:delete-user')->name('users.destroy');
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])
        ->middleware('permission:assign-role')->name('users.assign-role');
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
        ->middleware('permission:edit-user')->name('users.toggle-status');

    // ═══════════════════════════════════════════════════════
    // نامه‌ها
    // ✅ static routes اول، بعد {parameter}
    // ═══════════════════════════════════════════════════════
    Route::get('letters', [LetterController::class, 'index'])
        ->middleware('permission:view-letters')->name('letters.index');
    Route::get('letters/create', [LetterController::class, 'create'])
        ->middleware('permission:create-letter')->name('letters.create');
    Route::post('letters', [LetterController::class, 'store'])
        ->middleware('permission:create-letter')->name('letters.store');
    Route::get('letters/{letter}', [LetterController::class, 'show'])
        ->middleware('permission:view-letters')->name('letters.show');
    Route::get('letters/{letter}/edit', [LetterController::class, 'edit'])
        ->middleware('permission:edit-letter')->name('letters.edit');
    Route::put('letters/{letter}', [LetterController::class, 'update'])
        ->middleware('permission:edit-letter')->name('letters.update');
    Route::delete('letters/{letter}', [LetterController::class, 'destroy'])
        ->middleware('permission:delete-letter')->name('letters.destroy');
    Route::post('letters/{letter}/publish', [LetterController::class, 'publish'])
        ->middleware('permission:approve-letter')->name('letters.publish');
    Route::get('letters/{letter}/routings-history', [RoutingController::class, 'history'])
        ->middleware('permission:view-letters')->name('routings.history');
    Route::get('letters/{letter}/routing/create', [RoutingController::class, 'create'])
        ->middleware('permission:route-letter')->name('routings.create');
    Route::post('letters/{letter}/routing', [RoutingController::class, 'store'])
        ->middleware('permission:route-letter')->name('routings.store');

    // ═══════════════════════════════════════════════════════
    // پیوست‌ها
    // ═══════════════════════════════════════════════════════
    Route::get('attachments/{attachment}/download', [LetterController::class, 'downloadAttachment'])
        ->middleware('permission:view-letters')->name('attachments.download');

    // ═══════════════════════════════════════════════════════
    // کارتابل و ارجاعات
    // ═══════════════════════════════════════════════════════
    Route::get('cartable', [CartableController::class, 'index'])
        ->middleware('permission:view-letters')->name('cartable.index');
    Route::post('routings/{routing}/complete', [CartableController::class, 'complete'])
        ->middleware('permission:view-letters')->name('cartable.complete');
    Route::post('routings/{routing}/reject', [CartableController::class, 'reject'])
        ->middleware('permission:view-letters')->name('cartable.reject');

    // ═══════════════════════════════════════════════════════
    // بایگانی و پرونده‌ها
    // ✅ static routes اول، بعد {parameter}
    // ═══════════════════════════════════════════════════════
    Route::get('archives', [ArchiveController::class, 'index'])
        ->middleware('permission:view-cases')->name('archives.index');
    Route::get('archives/create', [ArchiveController::class, 'create'])
        ->middleware('permission:create-case')->name('archives.create');
    Route::post('archives', [ArchiveController::class, 'store'])
        ->middleware('permission:create-case')->name('archives.store');
    Route::get('archives/{archive}', [ArchiveController::class, 'show'])
        ->middleware('permission:view-cases')->name('archives.show');
    Route::get('archives/{archive}/edit', [ArchiveController::class, 'edit'])
        ->middleware('permission:edit-case')->name('archives.edit');
    Route::put('archives/{archive}', [ArchiveController::class, 'update'])
        ->middleware('permission:edit-case')->name('archives.update');
    Route::delete('archives/{archive}', [ArchiveController::class, 'destroy'])
        ->middleware('permission:delete-case')->name('archives.destroy');
    Route::get('archives/{archive}/permissions', [ArchiveController::class, 'permissions'])
        ->middleware('permission:view-cases')->name('archives.permissions');

    // پرونده‌ها — nested under archives
    // ✅ static routes اول، بعد {parameter}
    Route::get('archives/{archive}/cases', [CaseController::class, 'index'])
        ->middleware('permission:view-cases')->name('archives.cases.index');
    Route::get('archives/{archive}/cases/create', [CaseController::class, 'create'])
        ->middleware('permission:create-case')->name('archives.cases.create');
    Route::post('archives/{archive}/cases', [CaseController::class, 'store'])
        ->middleware('permission:create-case')->name('archives.cases.store');
    Route::get('archives/{archive}/cases/{case}', [CaseController::class, 'show'])
        ->middleware('permission:view-cases')->name('archives.cases.show');
    Route::get('archives/{archive}/cases/{case}/edit', [CaseController::class, 'edit'])
        ->middleware('permission:edit-case')->name('archives.cases.edit');
    Route::put('archives/{archive}/cases/{case}', [CaseController::class, 'update'])
        ->middleware('permission:edit-case')->name('archives.cases.update');
    Route::delete('archives/{archive}/cases/{case}', [CaseController::class, 'destroy'])
        ->middleware('permission:delete-case')->name('archives.cases.destroy');
    Route::post('archives/{archive}/cases/{case}/attach-letter', [CaseController::class, 'attachLetter'])
        ->middleware('permission:edit-case')->name('archives.cases.attach-letter');
    Route::delete('archives/{archive}/cases/{case}/detach-letter/{letter}', [CaseController::class, 'detachLetter'])
        ->middleware('permission:edit-case')->name('archives.cases.detach-letter');

    // ═══════════════════════════════════════════════════════
    // گزارشات
    // ✅ static routes اول
    // ═══════════════════════════════════════════════════════
    Route::get('reports', [ReportController::class, 'index'])
        ->middleware('permission:view-reports')->name('reports.index');
    Route::get('reports/export-excel', [ReportController::class, 'exportExcel'])
        ->middleware('permission:export-reports')->name('reports.export-excel');
    Route::get('reports/export-pdf', [ReportController::class, 'exportPdf'])
        ->middleware('permission:export-reports')->name('reports.export-pdf');

    // ═══════════════════════════════════════════════════════
    // دسته‌بندی نامه‌ها
    // ✅ static routes اول، بعد {parameter}
    // ═══════════════════════════════════════════════════════
    Route::get('categories', [LetterCategoryController::class, 'index'])
        ->middleware('permission:view-categories')->name('categories.index');
    Route::get('categories-list', [LetterCategoryController::class, 'getList'])
        ->middleware('permission:view-categories')->name('categories.list');
    Route::get('categories/create', [LetterCategoryController::class, 'create'])
        ->middleware('permission:create-category')->name('categories.create');
    Route::post('categories', [LetterCategoryController::class, 'store'])
        ->middleware('permission:create-category')->name('categories.store');
    Route::get('categories/{category}', [LetterCategoryController::class, 'show'])
        ->middleware('permission:view-categories')->name('categories.show');
    Route::get('categories/{category}/edit', [LetterCategoryController::class, 'edit'])
        ->middleware('permission:edit-category')->name('categories.edit');
    Route::put('categories/{category}', [LetterCategoryController::class, 'update'])
        ->middleware('permission:edit-category')->name('categories.update');
    Route::delete('categories/{category}', [LetterCategoryController::class, 'destroy'])
        ->middleware('permission:delete-category')->name('categories.destroy');
    Route::post('categories/{category}/toggle-status', [LetterCategoryController::class, 'toggleStatus'])
        ->middleware('permission:edit-category')->name('categories.toggle-status');

    // ═══════════════════════════════════════════════════════
    // تنظیمات سیستم
    // ═══════════════════════════════════════════════════════
    Route::get('settings', [SettingController::class, 'index'])
        ->middleware('role:super-admin|org-admin')->name('settings.index');
    Route::post('settings', [SettingController::class, 'update'])
        ->middleware('role:super-admin|org-admin')->name('settings.update');
});

require __DIR__ . '/settings.php';
