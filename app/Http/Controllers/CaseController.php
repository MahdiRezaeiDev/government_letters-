<?php

namespace App\Http\Controllers;

use App\Models\ArchiveCase;
use App\Models\Archive;
use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Enums\PermissionEnum;

class CaseController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth']);
    }

    /**
     * نمایش لیست پرونده‌ها در یک بایگانی
     */
    public function index(Request $request, Archive $archive)
    {
        $currentUser = auth()->user();
        
        // بررسی دسترسی به بایگانی
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        $query = $archive->cases()->with(['creator', 'archive']);
        
        // فیلتر جستجو
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('case_number', 'like', "%{$request->search}%");
            });
        }
        
        // فیلتر وضعیت
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
        
        $cases = $query->paginate(15);
        
        return Inertia::render('Cases/Index', [
            'archive' => $archive,
            'cases' => $cases,
            'filters' => $request->only(['search', 'is_active']),
            'can' => [
                'create' => $currentUser->can(PermissionEnum::CREATE_CASE->value),
            ],
        ]);
    }

    /**
     * نمایش فرم ایجاد پرونده جدید
     */
    public function create(Archive $archive)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        return Inertia::render('Cases/Create', [
            'archive' => $archive,
        ]);
    }

    /**
     * ذخیره پرونده جدید
     */
    public function store(Request $request, Archive $archive)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive)) {
            abort(403);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'case_number' => 'required|string|max:50|unique:cases,case_number',
            'description' => 'nullable|string',
            'retention_period' => 'nullable|integer|min:1',
            'retention_unit' => 'nullable|in:days,months,years',
            'expiry_date' => 'nullable|date|after:today',
            'is_active' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $case = $archive->cases()->create([
            'title' => $request->title,
            'case_number' => $request->case_number,
            'description' => $request->description,
            'retention_period' => $request->retention_period,
            'retention_unit' => $request->retention_unit,
            'expiry_date' => $request->expiry_date,
            'is_active' => $request->is_active ?? true,
            'created_by' => $currentUser->id,
        ]);
        
        return redirect()->route('archives.cases.show', [$archive->id, $case->id])
            ->with('success', 'پرونده با موفقیت ایجاد شد.');
    }

    /**
     * نمایش جزئیات پرونده
     */
    public function show(Archive $archive, ArchiveCase $case)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive) || $case->archive_id !== $archive->id) {
            abort(403);
        }
        
        $case->load(['creator', 'archive', 'letters' => function ($q) {
            $q->with(['senderDepartment', 'category']);
        }]);
        
        $stats = [
            'total_letters' => $case->letters()->count(),
            'archived_date' => $case->created_at->format('Y/m/d'),
            'expiry_date' => $case->expiry_date?->format('Y/m/d'),
        ];
        
        return Inertia::render('Cases/Show', [
            'archive' => $archive,
            'case' => $case,
            'stats' => $stats,
        ]);
    }

    /**
     * نمایش فرم ویرایش پرونده
     */
    public function edit(Archive $archive, ArchiveCase $case)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive) || $case->archive_id !== $archive->id) {
            abort(403);
        }
        
        return Inertia::render('Cases/Edit', [
            'archive' => $archive,
            'case' => $case,
        ]);
    }

    /**
     * به‌روزرسانی پرونده
     */
    public function update(Request $request, Archive $archive, ArchiveCase $case)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive) || $case->archive_id !== $archive->id) {
            abort(403);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'case_number' => 'required|string|max:50|unique:cases,case_number,' . $case->id,
            'description' => 'nullable|string',
            'retention_period' => 'nullable|integer|min:1',
            'retention_unit' => 'nullable|in:days,months,years',
            'expiry_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $case->update([
            'title' => $request->title,
            'case_number' => $request->case_number,
            'description' => $request->description,
            'retention_period' => $request->retention_period,
            'retention_unit' => $request->retention_unit,
            'expiry_date' => $request->expiry_date,
            'is_active' => $request->is_active ?? true,
        ]);
        
        return redirect()->route('archives.cases.show', [$archive->id, $case->id])
            ->with('success', 'پرونده با موفقیت به‌روزرسانی شد.');
    }

    /**
     * الصاق نامه به پرونده
     */
    public function attachLetter(Request $request, Archive $archive, ArchiveCase $case)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive) || $case->archive_id !== $archive->id) {
            abort(403);
        }
        
        $validator = Validator::make($request->all(), [
            'letter_id' => 'required|exists:letters,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $letter = Letter::find($request->letter_id);
        
        // بررسی اینکه نامه متعلق به همان سازمان باشد
        if ($letter->organization_id !== $archive->department->organization_id) {
            return response()->json(['message' => 'نامه متعلق به این سازمان نیست.'], 403);
        }
        
        // الصاق نامه به پرونده
        $case->letters()->attach($request->letter_id, [
            'archived_at' => now(),
            'archived_by' => $currentUser->id,
        ]);
        
        // بروزرسانی وضعیت نامه
        $letter->update(['final_status' => 'archived']);
        
        return response()->json(['message' => 'نامه با موفقیت به پرونده الصاق شد.']);
    }

    /**
     * جدا کردن نامه از پرونده
     */
    public function detachLetter(Request $request, Archive $archive, ArchiveCase $case, Letter $letter)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive) || $case->archive_id !== $archive->id) {
            abort(403);
        }
        
        $case->letters()->detach($letter->id);
        
        return response()->json(['message' => 'نامه با موفقیت از پرونده جدا شد.']);
    }

    /**
     * حذف پرونده
     */
    public function destroy(Archive $archive, ArchiveCase $case)
    {
        $currentUser = auth()->user();
        
        if (!$this->canAccessArchive($currentUser, $archive) || $case->archive_id !== $archive->id) {
            abort(403);
        }
        
        // بررسی وجود نامه در پرونده
        if ($case->letters()->count() > 0) {
            return back()->with('error', 'این پرونده دارای نامه است و قابل حذف نمی‌باشد.');
        }
        
        $case->delete();
        
        return redirect()->route('archives.cases.index', $archive->id)
            ->with('success', 'پرونده با موفقیت حذف شد.');
    }
    
    private function canAccessArchive($user, Archive $archive): bool
    {
        if ($user->isSuperAdmin()) return true;
        if ($user->isOrgAdmin()) {
            return $user->organization_id === $archive->department->organization_id;
        }
        if ($user->isDeptManager()) {
            return $user->department_id === $archive->department_id;
        }
        return false;
    }
}