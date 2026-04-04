<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        // $this->authorize('organization.manage');

        $departments = Department::where('organization_id', auth()->user()->organization_id)
            ->with('parent:id,name')
            ->withCount('positions')
            ->orderBy('level')->orderBy('name')
            ->get();

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('organization.manage');

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'code'      => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:departments,id',
            'status'    => 'required|in:active,inactive',
        ]);

        $level = 0;
        $path  = '';

        if (!empty($validated['parent_id'])) {
            $parent = Department::find($validated['parent_id']);
            $level  = $parent->level + 1;
            $path   = $parent->path . '/' . $parent->id;
        }

        Department::create([
            ...$validated,
            'organization_id' => auth()->user()->organization_id,
            'level'           => $level,
            'path'            => $path,
        ]);

        return back()->with('success', 'واحد ایجاد شد');
    }

    public function update(Request $request, Department $department)
    {
        $this->authorize('organization.manage');

        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'code'   => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive',
        ]);

        $department->update($validated);
        return back()->with('success', 'واحد آپدیت شد');
    }

    public function destroy(Department $department)
    {
        $this->authorize('organization.manage');

        if ($department->positions()->count() > 0) {
            return back()->with('error', 'این واحد دارای سمت است');
        }

        if ($department->children()->count() > 0) {
            return back()->with('error', 'این واحد دارای زیرمجموعه است');
        }

        $department->delete();
        return back()->with('success', 'واحد حذف شد');
    }
}
