<?php
namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterCategory;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LetterController extends Controller
{
    public function index()
    {
        $letters = Letter::where('organization_id', auth()->user()->organization_id)
            ->with(['category', 'creator'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Letters/Index', [
            'letters' => $letters
        ]);
    }

    public function create()
    {
      return Inertia::render('Letters/Create', [
        'categories' => LetterCategory::where('organization_id', auth()->user()->organization_id)
                                      ->where('status', true)
                                      ->get(['id', 'name']),
    ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'letter_type'    => 'required|in:incoming,outgoing,internal',
            'subject'        => 'required|string|max:500',
            'content'        => 'nullable|string',
            'priority'       => 'required|in:low,normal,high,urgent,very_urgent',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'date'           => 'required|date',
        ]);

        $user = auth()->user();

        Letter::create([
            ...$validated,
            'organization_id' => $user->organization_id,
            'created_by'      => $user->id,
            'final_status'    => 'draft',
            'is_draft'        => true,
            'sender_name'     => $user->first_name . ' ' . $user->last_name,
            'sender_position' => $user->activePosition?->name,
        ]);

        return redirect()->route('letters.index')
                         ->with('success', 'نامه ذخیره شد');
    }

    public function show(Letter $letter)
    {
        $letter->load([
            'category', 'creator', 'attachments',
            'keywords', 'routings',
        ]);

        return Inertia::render('Letters/Show', [
            'letter' => $letter
        ]);
    }

    public function edit(Letter $letter)
    {
        return Inertia::render('Letters/Edit', [
            'letter' => $letter
        ]);
    }

    public function update(Request $request, Letter $letter)
    {
        $letter->update([
            ...$request->validated(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('letters.index')
                         ->with('success', 'نامه آپدیت شد');
    }

    public function destroy(Letter $letter)
    {
        $letter->delete();

        return redirect()->route('letters.index')
                         ->with('success', 'نامه حذف شد');
    }
}