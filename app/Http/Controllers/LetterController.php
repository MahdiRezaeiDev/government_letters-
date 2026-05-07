<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\Position;
use App\Models\Department;
use App\Models\Attachment;
use App\Models\Routing;
use App\Models\LetterHistory;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Enums\PriorityLevelEnum;
use App\Enums\SecurityLevelEnum;
use App\Http\Requests\LetterRequest;
use App\Models\User;
use App\Services\LetterService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class LetterController extends Controller
{
    use AuthorizesRequests;
    public function __construct(protected LetterService $letterService) {}

    // =========================================================
    // INDEX
    // =========================================================

    public function index(Request $request)
    {
        $this->authorize('viewAny', Letter::class);

        $user = auth()->user();
        $query = Letter::query()->with([
            'category',
            'createdBy',
            'senderDepartment',
            'senderOrganization',
            'recipientDepartment',
            'recipientOrganization',
            'senderUser',
            'recipientUser',
            'userView',
            'replies' => function ($q) {
                $q->select('id', 'parent_letter_id');
            },
        ])->withCount('replies');

        // ── فیلتر بر اساس دسترسی کاربر ───────────────────────────────
        if ($user->isSuperAdmin()) {
            if ($request->filled('organization_id')) {
                $query->where('organization_id', $request->organization_id);
            }
        } elseif ($user->isOrgAdmin()) {
            $query->where('organization_id', $user->organization_id)
                ->orWhere('recipient_organization_id', $user->organization_id);
        } elseif ($user->isDeptManager()) {
            $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                    ->orWhere('recipient_department_id', $user->department_id);
            });
        } else {
            // کاربر عادی: مکتوب‌هایی که مرتبط با اوست
            $query->where(function ($q) use ($user) {
                $q->where('sender_user_id', $user->id)      // من فرستنده هستم
                    ->orWhere('recipient_user_id', $user->id) // من گیرنده هستم
                    ->orWhere('created_by', $user->id);       // من ایجاد کننده پیش‌نویس هستم
            });
        }

        // ── فیلتر جهت (صادره/وارده) ──────────────────────────────────
        if ($request->filled('direction')) {
            if ($request->direction === 'outgoing') {
                $query->outgoing($user);
            } elseif ($request->direction === 'incoming') {
                $query->incoming($user);
            }
        }

        // ── فیلترهای جستجو ──────────────────────────────────
        $query->when($request->filled('letter_type'), function ($q) use ($request) {
            return $q->where('letter_type', $request->letter_type);
        })
            ->when($request->filled('status'), function ($q) use ($request) {
                return $q->where('final_status', $request->status);
            })
            ->when($request->filled('priority'), function ($q) use ($request) {
                return $q->where('priority', $request->priority);
            })
            ->when($request->filled('date_from'), function ($q) use ($request) {
                return $q->whereDate('date', '>=', $request->date_from);
            })
            ->when($request->filled('date_to'), function ($q) use ($request) {
                return $q->whereDate('date', '<=', $request->date_to);
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                return $q->where(function ($s) use ($search) {
                    $s->where('subject', 'like', "%{$search}%")
                        ->orWhere('letter_number', 'like', "%{$search}%")
                        ->orWhere('tracking_number', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%")
                        ->orWhere('sender_name', 'like', "%{$search}%")
                        ->orWhere('recipient_name', 'like', "%{$search}%");
                });
            });

        // ── مرتب‌سازی ──────────────────────────────────────────
        $query->orderByDesc('created_at');

        // ── پاجینیشن ───────────────────────────────────────────
        $letters = $query->paginate(15);

        // اضافه کردن اطلاعات نقش به هر مکتوب
        $letters->getCollection()->transform(function ($letter) use ($user) {
            $letter->user_role = $this->getUserLetterRole($letter, $user);
            return $letter;
        });

        $filters = $request->only(['search', 'letter_type', 'status', 'priority', 'date_from', 'date_to', 'direction', 'organization_id']);

        return Inertia::render('letters/index', [
            'letters'        => $letters,
            'categories'     => LetterCategory::where('organization_id', $user->organization_id)
                ->where('status', true)
                ->get(),
            'filters'        => $filters,
            'can'            => [
                'create' => $user->can('create', Letter::class),
                'edit'   => $user->can('update', $user),
                'delete' => $user->can('delete', $user),
            ],
            'types'          => [
                'internal' => 'مکتوب داخلی',
                'external' => 'مکتوب خارجی'
            ],
            'directions'     => [
                'incoming' => 'مکتوب‌های وارده',
                'outgoing' => 'مکتوب‌های صادره'
            ],
            'statuses'       => [
                'draft'    => 'پیش‌نویس',
                'pending'  => 'در انتظار',
                'approved' => 'تایید شده',
                'rejected' => 'رد شده',
                'archived' => 'بایگانی شده'
            ],
            'priorities'     => [
                'low'         => 'کم',
                'normal'      => 'عادی',
                'high'        => 'مهم',
                'urgent'      => 'فوری',
                'very_urgent' => 'خیلی فوری'
            ],
            'currentUserId'  => $user->id,
            'currentUserFullName' => $user->full_name,
        ]);
    }
    private function getUserLetterRole($letter, $user)
    {
        if ($letter->sender_user_id === $user->id) {
            return 'sent';
        }
        if ($letter->recipient_user_id === $user->id) {
            return 'received';
        }
        if ($letter->created_by === $user->id && $letter->final_status === 'draft') {
            return 'draft';
        }
        return 'other';
    }
    // =========================================================
    // CREATE / STORE
    // =========================================================

    public function create()
    {
        $this->authorize('create', Letter::class);

        $user = auth()->user();

        $positions = Position::whereHas(
            'department',
            fn($q) =>
            $q->where('organization_id', $user->organization_id)
                ->where('status', 'active')
                ->where('id', '!=', $user->department_id)
        )
            ->with(['users:id,first_name,last_name'])
            ->get(['id', 'name', 'department_id'])
            ->map(fn($p) => [
                'id'            => $p->id,
                'name'          => $p->name,
                'department_id' => $p->department_id,
                'user_id'       => $p->users->first()?->id,
                'user_name'     => $p->users->first()?->full_name,
            ]);

        return Inertia::render('letters/create', [
            'departments'          => Department::where('organization_id', $user->organization_id)
                ->where('status', 'active')->get(['id', 'name']),
            'positions'            => $positions,
            'externalOrganizations' => Organization::where('id', '!=', $user->organization_id)
                ->where('status', 'active')->get(['id', 'name', 'code']),
            'securityLevels'       => $this->getSecurityLevels(),
            'priorityLevels'       => $this->getPriorityLevels(),
        ]);
    }

    public function store(LetterRequest $request)
    {
        $this->authorize('create', Letter::class);

        try {
            $user   = Auth::user()->load(['primaryPosition', 'department']);
            $letter = $this->letterService->createLetter($request->validated(), $user);

            return redirect()
                ->route('letters.show', $letter->id)
                ->with('success', $letter->is_draft ? 'پیش‌نویس ذخیره شد.' : 'مکتوب ثبت گردید.');
        } catch (\Exception $e) {
            return back()->with('error', 'خطا: ' . $e->getMessage())->withInput();
        }
    }

    // =========================================================
    // SHOW
    // =========================================================

    public function show(Letter $letter)
    {
        $this->authorize('view', $letter);  // ✅ جایگزین canViewLetter

        $user = auth()->user();

        $letter->load([
            'category',
            'createdBy',
            'senderUser',
            'senderDepartment.organization',  // برای footer آدرس/تلفن
            'recipientUser',
            'recipientDepartment',
            'routings.fromUser',
            'routings.toUser',
            'histories' => fn($q) => $q->with('user')->latest()->limit(20),
            'attachments',
            'cases',
            'replies.senderUser',
            'delegations.delegatedBy',      // اضافه شد - ارجاع‌دهنده
            'delegations.delegatedTo',      // اضافه شد - ارجاع‌گیرنده
            'activeDelegation',             // اضافه شد - آخرین ارجاع فعال
        ]);

        // ثبت بازدید
        $letter->views()->create([
            'user_id'    => $user->id,
            'viewed_at'  => now(),
            'ip_address' => request()->ip(),
        ]);

        $users = User::where('id', '!=', $user->id)
            ->with(['positions' => function ($q) {
                $q->wherePivot('is_primary', 1)  // فقط پوزیشن اصلی
                    ->with('department');         // بارگذاری دپارتمان پوزیشن
            }])
            ->get(['id', 'first_name', 'last_name'])
            ->map(fn($u) => [
                'id' => $u->id,
                'full_name' => $u->full_name,
                'position' => $u->positions->first() ? [
                    'name' => $u->positions->first()->name,
                    'department' => $u->positions->first()->department ? [
                        'name' => $u->positions->first()->department->name
                    ] : null
                ] : null,
            ]);

        return Inertia::render('letters/show', [
            'letter'         => $letter,
            'securityLevels' => $this->getSecurityLevels(),
            'priorityLevels' => $this->getPriorityLevels(),
            'organizations'  => Organization::all(),
            'users'          => $users,  // اضافه شد
            'can' => [
                'edit'    => $user->can('update', $letter),
                'delete'  => $user->can('delete', $letter),
                'archive' => $user->can('archive', $letter),
                'route'   => $user->can('route', $letter),
                'approve' => $user->can('approve', $letter),
                'sign'    => $user->can('sign', $letter),
                'reply'   => $user->can('reply', $letter),
                'delegate' => $user->can('delegate', $letter) ?? true, // اضافه شد - مجوز ارجاع
            ],
        ]);
    }

    // =========================================================
    // EDIT / UPDATE
    // =========================================================

    public function edit(Letter $letter)
    {
        $this->authorize('update', $letter);

        $user = auth()->user();

        $positions = Position::whereHas(
            'department',
            fn($q) =>
            $q->where('organization_id', $user->organization_id)
                ->where('status', 'active')
        )
            ->with(['users:id,first_name,last_name'])
            ->get(['id', 'name', 'department_id'])
            ->map(fn($p) => [
                'id'            => $p->id,
                'name'          => $p->name,
                'department_id' => $p->department_id,
                'user_id'       => $p->users->first()?->id,
                'user_name'     => $p->users->first()?->full_name,
            ]);

        return Inertia::render('letters/edit', [
            'letter'               => $letter->load('attachments'),
            'departments'          => Department::where('organization_id', $user->organization_id)
                ->where('status', 'active')->get(['id', 'name']),
            'positions'            => $positions,
            'externalOrganizations' => Organization::where('id', '!=', $user->organization_id)
                ->where('status', 'active')->get(['id', 'name', 'code']),
            'securityLevels'       => $this->getSecurityLevels(),
            'priorityLevels'       => $this->getPriorityLevels(),
        ]);
    }

    public function update(LetterRequest $request, Letter $letter)
    {
        $this->authorize('update', $letter);

        $letter->update($request->validated());

        return redirect()
            ->route('letters.show', $letter->id)
            ->with('success', 'مکتوب به‌روزرسانی شد.');
    }

    // =========================================================
    // DELETE / PUBLISH
    // =========================================================

    public function destroy(Letter $letter)
    {
        $this->authorize('delete', $letter);

        $letter->delete();

        return redirect()->route('letters.index')->with('success', 'مکتوب حذف شد.');
    }

    public function publish(Letter $letter)
    {
        $this->authorize('update', $letter);

        DB::beginTransaction();
        try {
            $letter->update([
                'is_draft'      => false,
                'letter_number' => $this->generateLetterNumber($letter->letter_type),
                'final_status'  => 'pending',
            ]);

            if ($letter->recipient_user_id) {
                $this->createRouting($letter, $letter->recipient_user_id);
            }

            LetterHistory::create([
                'letter_id'   => $letter->id,
                'action_type' => 'published',
                'user_id'     => auth()->id(),
                'ip_address'  => request()->ip(),
            ]);

            DB::commit();

            return redirect()->route('letters.show', $letter->id)->with('success', 'مکتوب منتشر شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا: ' . $e->getMessage());
        }
    }

    // =========================================================
    // ATTACHMENTS
    // =========================================================

    public function downloadAttachment(Attachment $attachment)
    {
        $this->authorize('view', $attachment->letter);

        abort_unless(Storage::disk('public')->exists($attachment->file_path), 404);

        $attachment->incrementDownloadCount();

        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }

    public function preview(Attachment $attachment)
    {
        $this->authorize('view', $attachment->letter);

        return Storage::disk('public')->response(
            $attachment->file_path,
            $attachment->file_name,
            ['Content-Type' => $attachment->mime_type]
        );
    }

    // =========================================================
    // REPLY
    // =========================================================

    public function replyForm(Letter $letter)
    {
        $this->authorize('view', $letter);

        $user = auth()->user();

        $positions = Position::whereHas(
            'department',
            fn($q) =>
            $q->where('organization_id', $user->organization_id)->where('status', 'active')
        )
            ->with(['users:id,first_name,last_name'])
            ->get(['id', 'name', 'department_id'])
            ->map(fn($p) => [
                'id'            => $p->id,
                'name'          => $p->name,
                'department_id' => $p->department_id,
                'user_id'       => $p->users->first()?->id,
                'user_name'     => $p->users->first()?->full_name,
            ]);

        return Inertia::render('letters/LettersReply', [
            'originalLetter'       => $letter->load(['attachments', 'senderDepartment']),
            'departments'          => Department::where('organization_id', $user->organization_id)
                ->where('status', 'active')->get(['id', 'name']),
            'positions'            => $positions,
            'externalOrganizations' => Organization::where('id', '!=', $user->organization_id)
                ->where('status', 'active')->get(['id', 'name', 'code']),
            'securityLevels'       => $this->getSecurityLevels(),
            'priorityLevels'       => $this->getPriorityLevels(),
        ]);
    }

    public function storeReply(LetterRequest $request, Letter $letter)
    {
        $this->authorize('view', $letter);

        DB::beginTransaction();
        try {
            $user  = Auth::user();
            $reply = $this->letterService->createReply($request->validated(), $letter, $user);

            DB::commit();

            return redirect()
                ->route('letters.show', $reply->id)
                ->with('success', $reply->is_draft ? 'پیش‌نویس پاسخ ذخیره شد.' : 'پاسخ ارسال شد.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'خطا: ' . $e->getMessage())->withInput();
        }
    }

    // =========================================================
    // HELPERS (private)
    // =========================================================

    private function getPriorityLevels()
    {
        return collect(PriorityLevelEnum::cases())->mapWithKeys(fn($priority) => [
            $priority->value => [
                'label' => $priority->label(),
                'activeColor' => $priority->activeColor(),
                'inactiveColor' => $priority->inactiveColor(),
            ]
        ]);
    }

    private function getSecurityLevels()
    {
        return collect(SecurityLevelEnum::cases())->mapWithKeys(fn($level) => [
            $level->value => [
                'label' => $level->label(),
                'activeColor' => $level->activeColor(),
                'inactiveColor' => $level->inactiveColor(),
            ]
        ]);
    }

    private function generateLetterNumber(string $type): string
    {
        $codes = ['incoming' => 'IN', 'outgoing' => 'OUT', 'internal' => 'INT'];
        $code  = $codes[$type] ?? strtoupper(substr($type, 0, 3));
        $year  = now()->format('Y');
        $month = now()->format('m');

        $last = Letter::where('letter_type', $type)->whereYear('created_at', $year)->orderByDesc('id')->first();
        $seq  = $last ? intval(substr($last->letter_number, -5)) + 1 : 1;

        return sprintf('%s/%s/%s/%05d', $code, $year, $month, $seq);
    }

    private function createRouting(Letter $letter, int $toUserId, ?string $instruction = null): void
    {
        Routing::create([
            'letter_id'   => $letter->id,
            'from_user_id' => auth()->id(),
            'to_user_id'  => $toUserId,
            'action_type' => $letter->letter_type === 'incoming' ? 'action' : 'approval',
            'instruction' => $instruction ?? 'لطفاً بررسی و اقدام لازم انجام شود.',
            'deadline'    => now()->addDays(7),
            'status'      => 'pending',
            'step_order'  => 1,
        ]);
    }
}
