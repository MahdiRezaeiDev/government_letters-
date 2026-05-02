<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\Position;
use App\Models\Department;
use App\Models\Attachment;
use App\Models\Routing;
use App\Models\LetterHistory;
use App\Models\ArchiveCase;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Enums\PriorityLevelEnum;
use App\Enums\SecurityLevelEnum;
use App\Http\Requests\LetterRequest;
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
            'recipientDepartment',
            'senderUser',
            'recipientUser',
        ]);

        // ── فیلتر بر اساس دسترسی کاربر ───────────────────────────────
        if ($user->isSuperAdmin()) {
            // سوپر ادمین: همه نامه‌ها را می‌بیند
            if ($request->filled('organization_id')) {
                $query->where('organization_id', $request->organization_id);
            }
        } elseif ($user->isOrgAdmin()) {
            // ادمین سازمان: فقط نامه‌های سازمان خودش
            $query->where('organization_id', $user->organization_id);
        } elseif ($user->isDeptManager()) {
            // مدیر دپارتمان: نامه‌هایی که دپارتمانش فرستنده یا گیرنده است
            $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                    ->orWhere('recipient_department_id', $user->department_id);
            });
        } else {
            // کاربر عادی: نامه‌هایی که مرتبط با اوست
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                    ->orWhere('sender_user_id', $user->id)
                    ->orWhere('recipient_user_id', $user->id)
                    ->orWhereHas('routings', function ($r) use ($user) {
                        $r->where('to_user_id', $user->id);
                    })
                    // برای نامه‌های خارجی که نام کاربری ندارد
                    ->orWhere(function ($sub) use ($user) {
                        $sub->where('letter_type', 'external')
                            ->where('recipient_name', 'like', "%{$user->full_name}%");
                    });
            });
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
            ->when($request->filled('direction'), function ($q) use ($request) {
                // فیلتر جهت نامه (ورودی/خروجی)
                if ($request->direction === 'incoming') {
                    return $q->where(function ($sub) use ($request) {
                        $sub->where(function ($inner) {
                            // نامه‌های داخلی: گیرنده کاربر فعلی
                            $inner->where('letter_type', 'internal')
                                ->where('recipient_user_id', auth()->id());
                        })->orWhere(function ($inner) {
                            // نامه‌های خارجی: گیرنده سازمان فعلی
                            $inner->where('letter_type', 'external')
                                ->whereNull('recipient_user_id');
                        });
                    });
                } elseif ($request->direction === 'outgoing') {
                    return $q->where(function ($sub) use ($request) {
                        $sub->where(function ($inner) {
                            // نامه‌های داخلی: فرستنده کاربر فعلی
                            $inner->where('letter_type', 'internal')
                                ->where('sender_user_id', auth()->id());
                        })->orWhere(function ($inner) {
                            // نامه‌های خارجی: فرستنده کاربر فعلی
                            $inner->where('letter_type', 'external')
                                ->where('sender_user_id', auth()->id());
                        });
                    });
                }
                return $q;
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

        // اضافه کردن قابلیت direction به فیلترها
        $filters = $request->only(['search', 'letter_type', 'status', 'priority', 'date_from', 'date_to', 'direction']);

        return Inertia::render('letters/index', [
            'letters'    => $letters,
            'categories' => LetterCategory::where('organization_id', $user->organization_id)
                ->where('status', true)
                ->get(),
            'filters'    => $filters,
            'can'        => [
                'create' => $user->can('create', Letter::class),
            ],
            'types'      => [
                'internal' => 'نامه داخلی',
                'external' => 'نامه خارجی'
            ],
            'directions' => [
                'all'      => 'همه',
                'incoming' => 'نامه‌های دریافتی',
                'outgoing' => 'نامه‌های ارسالی'
            ],
            'statuses'   => [
                'draft'    => 'پیش‌نویس',
                'pending'  => 'در انتظار',
                'approved' => 'تایید شده',
                'rejected' => 'رد شده',
                'archived' => 'بایگانی شده'
            ],
            'priorities' => [
                'low'         => 'کم',
                'normal'      => 'عادی',
                'high'        => 'مهم',
                'urgent'      => 'فوری',
                'very_urgent' => 'خیلی فوری'
            ],
        ]);
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
        ]);

        $letter->views()->create([
            'user_id'    => $user->id,
            'viewed_at'  => now(),
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('letters/show', [
            'letter'         => $letter,
            'securityLevels' => $this->getSecurityLevels(),
            'priorityLevels' => $this->getPriorityLevels(),
            'can' => [
                'edit'    => $user->can('update', $letter),
                'delete'  => $user->can('delete', $letter),
                'archive' => $user->can('archive', $letter),
                'route'   => $user->can('route', $letter),
                'approve' => $user->can('approve', $letter),
                'sign'    => $user->can('sign', $letter),
                'reply'   => $user->can('reply', $letter)
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
            ->with('success', 'نامه به‌روزرسانی شد.');
    }

    // =========================================================
    // DELETE / PUBLISH
    // =========================================================

    public function destroy(Letter $letter)
    {
        $this->authorize('delete', $letter);

        $letter->delete();

        return redirect()->route('letters.index')->with('success', 'نامه حذف شد.');
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

            return redirect()->route('letters.show', $letter->id)->with('success', 'نامه منتشر شد.');
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
