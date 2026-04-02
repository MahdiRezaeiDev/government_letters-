<?php
namespace App\Http\Controllers;

use App\Models\Archive;
use App\Models\Letter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index()
    {
        $orgId = auth()->user()->organization_id;

        $archives = Archive::where('organization_id', $orgId)
            ->with('parent:id,name')
            ->withCount('files')
            ->orderBy('name')
            ->get();

        return Inertia::render('Archives/Index', [
            'archives' => $archives,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'code'        => 'nullable|string|max:50',
            'parent_id'   => 'nullable|exists:archives,id',
            'description' => 'nullable|string',
        ]);

        Archive::create([
            ...$validated,
            'organization_id' => auth()->user()->organization_id,
            'is_active'       => true,
        ]);

        return back()->with('success', 'بایگانی ایجاد شد');
    }

    public function update(Request $request, Archive $archive)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $archive->update($validated);

        return back()->with('success', 'بایگانی آپدیت شد');
    }

    public function destroy(Archive $archive)
    {
        if ($archive->files()->count() > 0) {
            return back()->with('error', 'این بایگانی دارای پرونده است');
        }

        $archive->delete();

        return back()->with('success', 'بایگانی حذف شد');
    }
}