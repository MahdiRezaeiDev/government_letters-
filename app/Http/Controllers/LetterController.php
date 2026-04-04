<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Department;
use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\Organization;
use App\Models\Position;
use App\Models\User;
use App\Services\LetterNumberingService;
use App\Services\TrackingNumberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterController extends Controller
{
    public function index(Request $request)
    {
        $user  = auth()->user();
        $orgId = $user->organization_id;

        $letters = Letter::where(function ($q) use ($orgId) {
                $q->where('sender_id', $orgId)
                  ->orWhere('recipient_id', $orgId)
                  ->orWhere('organization_id', $orgId);
            })
            ->with(['category', 'creator'])
            ->when($request->type, function ($q) use ($request, $orgId) {
                if ($request->type === 'incoming') {
                    $q->where('recipient_id', $orgId);
                } elseif ($request->type === 'outgoing') {
                    $q->where('sender_id', $orgId);
                } elseif ($request->type === 'internal') {
                    $q->where('letter_type', 'internal');
                }
            })
            ->when($request->status, fn($q) =>
                $q->where('final_status', $request->status))
            ->latest()
            ->paginate(15);

        return Inertia::render('Letters/Index', [
            'letters' => $letters,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    public function create()
    {
        $user  = auth()->user();
        $orgId = $user->organization_id;

        return Inertia::render('Letters/Create', [
            'categories'    => LetterCategory::where('organization_id', $orgId)
                                             ->where('status', true)
                                             ->get(['id', 'name']),
            'organizations' => Organization::where('id', '!=', $orgId)
                                           ->where('status', 'active')
                                           ->get(['id', 'name']),
            'departments'   => Department::where('organization_id', $orgId)
                                         ->where('status', 'active')
                                         ->get(['id', 'name', 'parent_id']),
            'positions'     => Position::whereHas('department', fn($q) =>
                                   $q->where('organization_id', $orgId))
                                   ->get(['id', 'name', 'department_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'letter_type'             => 'required|in:outgoing,internal',
            'subject'                 => 'required|string|max:500',
            'content'                 => 'nullable|string',
            'summary'                 => 'nullable|string',
            'category_id'             => 'nullable|exists:letter_categories,id',
            'priority'                => 'required|in:low,normal,high,urgent,very_urgent',
            'security_level'          => 'required|in:public,internal,confidential,secret,top_secret',
            'date'                    => 'required|date',
            'due_date'                => 'nullable|date',
            'sender_id'               => 'nullable|integer',
            'sender_department_id'    => 'nullable|exists:departments,id',
            'recipient_id'            => 'nullable|integer',
            'recipient_department_id' => 'nullable|exists:departments,id',
            'temp_files'              => 'nullable|array',
            'temp_files.*.temp_id'    => 'required|string',
            'temp_files.*.file_name'  => 'required|string',
            'temp_files.*.file_size'  => 'required|integer',
            'temp_files.*.extension'  => 'required|string',
            'temp_files.*.mime_type'  => 'required|string',
        ]);

        $user      = auth()->user();
        $numbering = app(LetterNumberingService::class);
        $tracking  = app(TrackingNumberService::class);

        if ($validated['letter_type'] === 'outgoing') {
            $validated['sender_id'] = $user->organization_id;
        }

        $letter = Letter::create([
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

        if (!empty($validated['temp_files'])) {
            $this->moveTempFiles($letter, $validated['temp_files'], $user);
        }

        return redirect()->route('letters.index')
                         ->with('success', 'نامه ذخیره شد');
    }

    public function show(Letter $letter)
    {
        $orgId = auth()->user()->organization_id;

        $letter->load([
            'category', 'creator', 'attachments',
            'keywords', 'routings.toUser', 'routings.toPosition',
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
                                     
            'users'   =>        User::where('organization_id', $orgId)
                                    ->with('activePosition:positions.id,positions.name')  // ✅ مشخص کردن جدول
                                    ->get(['users.id', 'first_name', 'last_name']),       // ✅ اصلاح نام جدول
        ]);
    }

    public function edit(Letter $letter)
    {
        $orgId = auth()->user()->organization_id;

        return Inertia::render('Letters/Edit', [
            'letter'     => $letter,
            'categories' => LetterCategory::where('organization_id', $orgId)
                                          ->where('status', true)
                                          ->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Letter $letter)
    {
        if ($letter->final_status !== 'draft') {
            return back()->with('error', 'فقط پیش‌نویس قابل ویرایش است');
        }

        $validated = $request->validate([
            'letter_type'    => 'sometimes|in:outgoing,internal',
            'subject'        => 'sometimes|string|max:500',
            'content'        => 'nullable|string',
            'summary'        => 'nullable|string',
            'priority'       => 'sometimes|in:low,normal,high,urgent,very_urgent',
            'security_level' => 'sometimes|in:public,internal,confidential,secret,top_secret',
            'category_id'    => 'nullable|exists:letter_categories,id',
            'date'           => 'sometimes|date',
            'due_date'       => 'nullable|date',
        ]);

        $letter->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('letters.show', $letter)
                         ->with('success', 'نامه آپدیت شد');
    }

    public function destroy(Letter $letter)
    {
        if ($letter->final_status !== 'draft') {
            return back()->with('error', 'فقط پیش‌نویس قابل حذف است');
        }

        $letter->delete();

        return redirect()->route('letters.index')
                         ->with('success', 'نامه حذف شد');
    }

    private function moveTempFiles(Letter $letter, array $tempFiles, $user): void
    {
        foreach ($tempFiles as $tempFile) {
            $tempDir  = 'temp/' . $user->id;
            $allFiles = \Storage::disk('local')->files($tempDir);
            $tempPath = null;

            foreach ($allFiles as $file) {
                if (str_contains($file, $tempFile['temp_id'])) {
                    $tempPath = $file;
                    break;
                }
            }

            if (!$tempPath) continue;

            $newPath = "letters/{$letter->id}/{$tempFile['temp_id']}.{$tempFile['extension']}";

            \Storage::disk('public')->put(
                $newPath,
                \Storage::disk('local')->get($tempPath)
            );

            \Storage::disk('local')->delete($tempPath);

            Attachment::create([
                'letter_id'         => $letter->id,
                'user_id'           => $user->id,
                'uploader_name'     => $user->first_name . ' ' . $user->last_name,
                'uploader_position' => $user->activePosition?->name,
                'file_name'         => $tempFile['file_name'],
                'file_path'         => $newPath,
                'file_size'         => $tempFile['file_size'],
                'mime_type'         => $tempFile['mime_type'],
                'extension'         => $tempFile['extension'],
            ]);
        }
    }
}
