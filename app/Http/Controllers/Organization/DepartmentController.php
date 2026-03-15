<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $orgId = Auth::user()->organization_id;

        return Inertia::render('Organization/Departments', [
            'departments' => Department::with('parent', 'positions')
                ->where('organization_id', $orgId)
                ->whereNull('parent_id')
                ->with('allChildren')
                ->get(),
            'organizations' => Organization::active()->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'code'            => 'nullable|string|max:50',
            'organization_id' => 'required|exists:organizations,id',
            'parent_id'       => 'nullable|exists:departments,id',
            'status'          => 'required|in:active,inactive',
        ]);

        $department = Department::create($validated);
        $department->updatePath();

        return back()->with('success', 'واحد سازمانی با موفقیت ایجاد شد.');
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'code'      => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:departments,id',
            'status'    => 'required|in:active,inactive',
        ]);

        $department->update($validated);
        $department->updatePath();

        return back()->with('success', 'واحد سازمانی به‌روزرسانی شد.');
    }

    public function destroy(Department $department)
    {
        if ($department->children()->exists()) {
            return back()->withErrors(['error' => 'ابتدا واحدهای زیرمجموعه را حذف کنید.']);
        }
        $department->delete();
        return back()->with('success', 'واحد سازمانی حذف شد.');
    }
}
