<?php
namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\Organization;
use App\Models\Position;
use App\Models\User;
use App\Services\LetterNumberingService;
use App\Services\TrackingNumberService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LetterController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $orgId = $user->organization_id;

        $letters = Letter::where(function($query) use ($orgId) {
                // نامه‌هایی که ما فرستادیم
                $query->where('sender_id', $orgId)
                // یا به ما رسیده
                ->orWhere('recipient_id', $orgId);
            })
            ->with(['category', 'creator'])
            ->when($request->type, function($query) use ($request, $orgId) {
                if ($request->type === 'incoming') {
                    $query->where('recipient_id', $orgId);
                } elseif ($request->type === 'outgoing') {
                    $query->where('sender_id', $orgId);
                } elseif ($request->type === 'internal') {
                    $query->where('letter_type', 'internal');
                }
            })
            ->when($request->status, fn($query) =>
                $query->where('final_status', $request->status))
            ->latest()
            ->paginate(15);

        return Inertia::render('Letters/Index', [
            'letters' => $letters,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    // LetterController.php
    public function create()
    {
        $user = auth()->user();

        return Inertia::render('Letters/Create', [
            'categories'  => LetterCategory::where('organization_id', $user->organization_id)
                                        ->where('status', true)
                                        ->get(['id', 'name']),

            // سازمان‌های طرف مکاتبه (غیر از خودمان)
            'organizations' => Organization::where('id', '!=', $user->organization_id)
                                        ->where('status', 'active')
                                        ->get(['id', 'name']),

            // واحدهای داخلی خودمان
            'departments'   => Department::where('organization_id', $user->organization_id)
                                        ->where('status', 'active')
                                        ->get(['id', 'name', 'parent_id']),

            // سمت‌های داخلی خودمان
            'positions'     => Position::whereHas('department', function ($q) use ($user) {
                                    $q->where('organization_id', $user->organization_id);
                                })
                                    ->get(['id', 'name', 'department_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'letter_type'            => 'required|in:outgoing,internal',
            'subject'                => 'required|string|max:500',
            'content'                => 'nullable|string',
            'summary'                => 'nullable|string',
            'category_id'            => 'nullable|exists:letter_categories,id',
            'priority'               => 'required|in:low,normal,high,urgent,very_urgent',
            'security_level'         => 'required|in:public,internal,confidential,secret,top_secret',
            'date'                   => 'required|date',
            'due_date'               => 'nullable|date',
            'sender_id'              => 'nullable|integer',
            'sender_department_id'   => 'nullable|exists:departments,id',
            'recipient_id'           => 'nullable|integer',
            'recipient_department_id'=> 'nullable|exists:departments,id',
        ]);

        $user = auth()->user();
        $numbering = app(LetterNumberingService::class);
        $tracking  = app(TrackingNumberService::class);

        // اگه sender_id نیومد، سازمان خودمون رو بذار
        if ($validated['letter_type'] === 'outgoing') {
            $validated['sender_id'] = $user->organization_id;
        }

        Letter::create([
            ...$validated,
            'organization_id' => $user->organization_id,
            'letter_number'   => $numbering->generate($validated['letter_type'], $user->organization_id),
            'tracking_number' => $tracking->generate(),
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
        $orgId = auth()->user()->organization_id;

        $letter->load([
            'category', 'creator', 'attachments', 'keywords',
            'routings.toUser', 'routings.toPosition',
            'routings.fromUser',
        ]);

        return Inertia::render('Letters/Show', [
            'letter'          => $letter,
            'uploadUrl'       => route('attachments.store', $letter),
            'storeRoutingUrl' => route('routings.store', $letter),
            'positions'       => Position::whereHas('department', fn($q) =>
                                    $q->where('organization_id', $orgId))
                                    ->with('department:id,name')
                                    ->get(['id', 'name', 'department_id']),
            'users'           => User::where('organization_id', $orgId)
                                    ->with('activePosition:positions.id,positions.name')  // ✅ مشخص کردن جدول
                                    ->get(['users.id', 'first_name', 'last_name']),
        ]);
    }
    public function edit(Letter $letter)
    {
        return Inertia::render('Letters/Edit', [
            'letter'     => $letter,
            'categories' => LetterCategory::where('organization_id', auth()->user()->organization_id)
                                        ->where('status', true)
                                        ->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Letter $letter)
    {
        $validated = $request->validate([
            'letter_type'    => 'required|in:incoming,outgoing,internal',
            'subject'        => 'required|string|max:500',
            'content'        => 'nullable|string',
            'priority'       => 'required|in:low,normal,high,urgent,very_urgent',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'date'           => 'required|date',
        ]);

        $letter->update([
            ...$validated,
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