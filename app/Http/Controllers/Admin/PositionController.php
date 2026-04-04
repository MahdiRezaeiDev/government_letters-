<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index()
    {
        $this->authorize('organization.manage');

        $orgId = auth()->user()->organization_id;

        return Inertia::render('Admin/Positions/Index', [
            'positions'   => Position::whereHas('department', fn($q) =>
                                $q->where('organization_id', $orgId))
                                ->with('department:id,name')
                                ->withCount('userPositions')
                                ->orderBy('department_id')->orderBy('level')
                                ->get(),
            'departments' => Department::where('organization_id', $orgId)
                                       ->where('status', 'active')
                                       ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('organization.manage');

        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name'          => 'required|string|max:255',
            'code'          => 'nullable|string|max:50|unique:positions',
            'level'         => 'required|integer|min:1|max:10',
            'is_management' => 'boolean',
            'description'   => 'nullable|string',
        ]);

        Position::create($validated);
        return back()->with('success', 'سمت ایجاد شد');
    }

    public function update(Request $request, Position $position)
    {
        $this->authorize('organization.manage');

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'level'         => 'required|integer|min:1|max:10',
            'is_management' => 'boolean',
            'description'   => 'nullable|string',
        ]);

        $position->update($validated);
        return back()->with('success', 'سمت آپدیت شد');
    }

    public function destroy(Position $position)
    {
        $this->authorize('organization.manage');

        if ($position->userPositions()->where('status', 'active')->count() > 0) {
            return back()->with('error', 'این سمت دارای کاربر فعال است');
        }

        $position->delete();
        return back()->with('success', 'سمت حذف شد');
    }
}
