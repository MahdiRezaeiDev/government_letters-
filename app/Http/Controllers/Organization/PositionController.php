<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\Department;
use App\Models\User;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index()
    {
        $orgId = Auth::user()->organization_id;

        return Inertia::render('Organization/Positions', [
            'positions' => Position::with(['department.organization', 'userPositions.user'])
                ->whereHas('department', fn($q) => $q->where('organization_id', $orgId))
                ->paginate(20),
            'departments' => Department::where('organization_id', $orgId)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name'          => 'required|string|max:255',
            'code'          => 'required|string|max:50|unique:positions',
            'level'         => 'nullable|integer|min:0',
            'is_management' => 'boolean',
            'description'   => 'nullable|string',
        ]);

        Position::create($validated);
        return back()->with('success', 'سمت با موفقیت ایجاد شد.');
    }

    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'code'          => 'required|string|max:50|unique:positions,code,' . $position->id,
            'level'         => 'nullable|integer|min:0',
            'is_management' => 'boolean',
            'description'   => 'nullable|string',
        ]);

        $position->update($validated);
        return back()->with('success', 'سمت به‌روزرسانی شد.');
    }

    public function destroy(Position $position)
    {
        if ($position->userPositions()->where('status', 'active')->exists()) {
            return back()->withErrors(['error' => 'این سمت دارای کاربر فعال است.']);
        }
        $position->delete();
        return back()->with('success', 'سمت حذف شد.');
    }
}
