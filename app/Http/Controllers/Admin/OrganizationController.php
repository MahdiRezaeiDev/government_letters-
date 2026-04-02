<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        $this->authorize('organization.manage');

        $organizations = Organization::withCount(['departments', 'users'])
            ->with('parent:id,name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => $organizations,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('organization.manage');

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'code'      => 'required|string|max:50|unique:organizations',
            'email'     => 'nullable|email',
            'phone'     => 'nullable|string|max:50',
            'address'   => 'nullable|string',
            'parent_id' => 'nullable|exists:organizations,id',
            'status'    => 'required|in:active,inactive',
        ]);

        Organization::create($validated);

        return back()->with('success', 'سازمان ایجاد شد');
    }

    public function update(Request $request, Organization $organization)
    {
        $this->authorize('organization.manage');

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status'  => 'required|in:active,inactive',
        ]);

        $organization->update($validated);

        return back()->with('success', 'سازمان آپدیت شد');
    }

    public function destroy(Organization $organization)
    {
        $this->authorize('organization.manage');

        if ($organization->users()->count() > 0) {
            return back()->with('error', 'این سازمان دارای کاربر است');
        }

        $organization->delete();

        return back()->with('success', 'سازمان حذف شد');
    }
}