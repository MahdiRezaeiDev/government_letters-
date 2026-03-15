<?php

namespace App\Http\Controllers\Letter;

use App\Http\Controllers\Controller;
use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\User;
use App\Models\Position;
use App\Services\LetterNumberingService;
use App\Services\WorkflowService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LetterController extends Controller
{
    public function __construct(
        private LetterNumberingService $numberingService,
        private WorkflowService $workflowService,
    ) {}

    /**
     * لیست نامه‌ها
     */
    public function index(Request $request): Response
    {
        $query = Letter::with(['category', 'createdBy', 'attachments'])
            ->where('organization_id', Auth::user()->organization_id)
            ->when($request->type, fn($q) => $q->where('letter_type', $request->type))
            ->when($request->status, fn($q) => $q->where('final_status', $request->status))
            ->when($request->priority, fn($q) => $q->where('priority', $request->priority))
            ->when($request->search, fn($q) => $q->where(function ($q2) use ($request) {
                $q2->where('subject', 'like', "%{$request->search}%")
                   ->orWhere('letter_number', 'like', "%{$request->search}%")
                   ->orWhere('tracking_number', 'like', "%{$request->search}%");
            }))
            ->orderByDesc('date');

        $letters = $query->paginate(15)->withQueryString();

        return Inertia::render('Letters/Index', [
            'letters'    => $letters,
            'filters'    => $request->only(['type', 'status', 'priority', 'search']),
            'categories' => LetterCategory::where('organization_id', Auth::user()->organization_id)->get(),
        ]);
    }

    /**
     * فرم ایجاد نامه
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Letters/Create', [
            'type'       => $request->type ?? 'incoming',
            'categories' => LetterCategory::where('organization_id', Auth::user()->organization_id)->active()->get(),
            'users'      => User::where('organization_id', Auth::user()->organization_id)->where('status', 'active')->get(['id', 'first_name', 'last_name']),
            'positions'  => Position::with('department')->whereHas('department', function($q) {
                $q->where('organization_id', Auth::user()->organization_id);
            })->get(),
        ]);
    }

    /**
     * ذخیره نامه جدید
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'letter_type'    => 'required|in:incoming,outgoing,internal',
            'subject'        => 'required|string|max:500',
            'content'        => 'nullable|string',
            'summary'        => 'nullable|string',
            'priority'       => 'required|in:low,normal,high,urgent,very_urgent',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'category_id'    => 'nullable|exists:letter_categories,id',
            'date'           => 'required|date',
            'due_date'       => 'nullable|date|after_or_equal:date',
            'sender_name'    => 'nullable|string|max:255',
            'sender_position'=> 'nullable|string|max:255',
            'recipient_name' => 'nullable|string|max:255',
            'sheet_count'    => 'nullable|integer|min:1',
            'is_draft'       => 'boolean',
            'attachments'    => 'nullable|array',
            'attachments.*'  => 'file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
        ]);

        $letter = DB::transaction(function () use ($validated, $request) {
            // شماره‌گذاری خودکار (فقط برای نامه‌های نهایی)
            if (empty($validated['is_draft'])) {
                $validated['letter_number']   = $this->numberingService->generate($validated['letter_type'], Auth::user()->organization_id);
                $validated['tracking_number'] = $this->numberingService->generateTracking();
                $validated['final_status']    = 'pending';
            } else {
                $validated['final_status'] = 'draft';
            }

            $validated['organization_id'] = Auth::user()->organization_id;
            $validated['created_by']      = Auth::id();

            $letter = Letter::create($validated);

            // ذخیره پیوست‌ها
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store("letters/{$letter->id}", 'public');
                    $letter->attachments()->create([
                        'user_id'   => Auth::id(),
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                        'extension' => $file->getClientOriginalExtension(),
                    ]);
                }
            }

            return $letter;
        });

        return redirect()->route('letters.show', $letter)
            ->with('success', 'نامه با موفقیت ثبت شد.');
    }

    /**
     * نمایش جزئیات نامه
     */
    public function show(Letter $letter): Response
    {
        $this->authorize('view', $letter);

        $letter->load([
            'category', 'createdBy', 'attachments',
            'routings.fromUser', 'routings.toUser',
            'routings.actions.user',
            'keywords', 'responseToLetter', 'responses',
        ]);

        return Inertia::render('Letters/Show', [
            'letter'    => $letter,
            'users'     => User::where('organization_id', Auth::user()->organization_id)
                              ->where('status', 'active')->get(['id', 'first_name', 'last_name']),
            'positions' => Position::with('department')->whereHas('department', function($q) {
                $q->where('organization_id', Auth::user()->organization_id);
            })->get(['id', 'name']),
        ]);
    }

    /**
     * فرم ویرایش
     */
    public function edit(Letter $letter): Response
    {
        $this->authorize('update', $letter);

        return Inertia::render('Letters/Edit', [
            'letter'     => $letter->load('attachments', 'keywords'),
            'categories' => LetterCategory::where('organization_id', Auth::user()->organization_id)->get(),
        ]);
    }

    /**
     * به‌روزرسانی نامه
     */
    public function update(Request $request, Letter $letter)
    {
        $this->authorize('update', $letter);

        $validated = $request->validate([
            'subject'        => 'required|string|max:500',
            'content'        => 'nullable|string',
            'summary'        => 'nullable|string',
            'priority'       => 'required|in:low,normal,high,urgent,very_urgent',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'category_id'    => 'nullable|exists:letter_categories,id',
            'date'           => 'required|date',
            'due_date'       => 'nullable|date',
        ]);

        $validated['updated_by'] = Auth::id();
        $letter->update($validated);

        return redirect()->route('letters.show', $letter)
            ->with('success', 'نامه با موفقیت به‌روزرسانی شد.');
    }

    /**
     * حذف نامه
     */
    public function destroy(Letter $letter)
    {
        $this->authorize('delete', $letter);
        $letter->delete();

        return redirect()->route('letters.index')
            ->with('success', 'نامه با موفقیت حذف شد.');
    }

    /**
     * ارجاع نامه
     */
    public function route(Request $request, Letter $letter)
    {
        $validated = $request->validate([
            'to_user_id'     => 'nullable|exists:users,id',
            'to_position_id' => 'nullable|exists:positions,id',
            'action_type'    => 'required|in:action,information,approval,coordination,sign',
            'instruction'    => 'nullable|string',
            'deadline'       => 'nullable|date',
        ]);

        $this->workflowService->route($letter, $validated);

        return back()->with('success', 'نامه با موفقیت ارجاع داده شد.');
    }
}
