<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        return Inertia::render('Organization/Index', [
            'organizations' => Organization::withCount('departments', 'users')
                ->whereNull('parent_id')
                ->with('children')
                ->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'code'      => 'required|string|max:50|unique:organizations',
            'address'   => 'nullable|string',
            'phone'     => 'nullable|string|max:50',
            'email'     => 'nullable|email',
            'parent_id' => 'nullable|exists:organizations,id',
            'status'    => 'required|in:active,inactive',
        ]);

        Organization::create($validated);

        return back()->with('success', 'سازمان با موفقیت ایجاد شد.');
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'code'   => 'required|string|max:50|unique:organizations,code,' . $organization->id,
            'status' => 'required|in:active,inactive',
        ]);

        $organization->update($validated);
        return back()->with('success', 'سازمان با موفقیت به‌روزرسانی شد.');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();
        return back()->with('success', 'سازمان حذف شد.');
    }
}
