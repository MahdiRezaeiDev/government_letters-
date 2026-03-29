<?php

namespace App\Http\Controllers;

use App\Http\Requests\Letter\{StoreLetterRequest, UpdateLetterRequest};
use App\Models\Letter;
use App\Repositories\LetterRepository;
use App\Services\LetterNumberingService;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class LetterController extends Controller
{
    public function __construct(
        private LetterRepository       $letterRepository,
        private LetterNumberingService $numberingService,
    ) {}

    public function index(Request $request): Response
    {
        $letters = $this->letterRepository->paginate(
            filters: $request->only(['type', 'status', 'priority', 'date_from', 'date_to', 'search']),
            organizationId: auth()->user()->organization_id,
        );

        return Inertia::render('Letter/Index', [
            'letters'    => $letters,
            'filters'    => $request->only(['type', 'status', 'priority', 'search']),
            'stats'      => $this->letterRepository->quickStats(auth()->user()->organization_id),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Letter/Create', [
            'letterTypes'    => config('correspondence.letter_types'),
            'securityLevels' => config('correspondence.security_levels'),
            'priorities'     => config('correspondence.priority_levels'),
            'categories'     => \App\Models\LetterCategory::forOrganization(auth()->user()->organization_id)->get(),
        ]);
    }

    public function store(StoreLetterRequest $request)
    {
        $data = $request->validated();
        $data['organization_id'] = auth()->user()->organization_id;
        $data['created_by'] = auth()->id();

        if (!$data['is_draft']) {
            $data['letter_number'] = $this->numberingService->generate(
                $data['letter_type'],
                $data['organization_id']
            );
            $data['tracking_number'] = $this->numberingService->generateTracking();
        }

        $letter = $this->letterRepository->create($data);

        // Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('letters/' . $letter->id, 'public');
                $letter->attachments()->create([
                    'user_id'   => auth()->id(),
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension(),
                ]);
            }
        }

        return redirect()->route('letters.show', $letter)
            ->with('success', 'نامه با موفقیت ثبت شد.');
    }

    public function show(Letter $letter): Response
    {
        $this->authorize('view', $letter);

        $letter->load([
            'category', 'attachments', 'createdBy',
            'routings.toUser', 'routings.fromUser', 'routings.actions',
            'keywords', 'files.archive',
        ]);

        return Inertia::render('Letter/Show', [
            'letter' => $letter,
        ]);
    }

    public function update(UpdateLetterRequest $request, Letter $letter)
    {
        $this->authorize('update', $letter);

        $data = $request->validated();
        $data['updated_by'] = auth()->id();

        $this->letterRepository->update($letter, $data);

        return redirect()->route('letters.show', $letter)
            ->with('success', 'نامه با موفقیت ویرایش شد.');
    }

    public function destroy(Letter $letter)
    {
        $this->authorize('delete', $letter);
        $letter->delete();

        return redirect()->route('letters.index')
            ->with('success', 'نامه حذف شد.');
    }
}