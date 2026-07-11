<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function index(Request $request)
    {
        $user = auth()->user();

        if (!$this->reportService->canAccessReports($user)) {
            abort(403, 'شما دسترسی به گزارشات ندارید.');
        }

        $report = $this->reportService->buildReport($user, $request);

        return Inertia::render('reports/index', [
            'report'        => $report,
            'filterOptions' => $this->reportService->getFilterOptions($user),
            'filters'       => $request->only([
                'date_from', 'date_to', 'type', 'status',
                'priority', 'organization_id', 'department_id',
            ]),
            'canExport' => $user->can('export-reports'),
        ]);
    }

    public function exportExcel(Request $request): StreamedResponse
    {
        $user = auth()->user();

        if (!$user->can('export-reports')) {
            abort(403);
        }

        $rows = $this->reportService->getExportRows($user, $request);

        $typeLabels = ['incoming' => 'وارده', 'outgoing' => 'صادره', 'internal' => 'داخلی'];
        $statusLabels = [
            'pending' => 'در انتظار', 'approved' => 'تایید شده',
            'rejected' => 'رد شده', 'archived' => 'بایگانی',
        ];
        $priorityLabels = [
            'low' => 'کم', 'normal' => 'عادی', 'high' => 'مهم',
            'urgent' => 'عاجل', 'very_urgent' => 'خیلی عاجل',
        ];

        $filename = 'letters-report-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($rows, $typeLabels, $statusLabels, $priorityLabels) {
            $handle = fopen('php://output', 'w');

            // BOM for Excel UTF-8
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'شماره مکتوب', 'موضوع', 'نوع', 'اولویت',
                'وضعیت', 'فرستنده', 'گیرنده', 'تاریخ',
            ]);

            foreach ($rows as $letter) {
                fputcsv($handle, [
                    $letter->letter_number,
                    $letter->subject,
                    $typeLabels[$letter->letter_type] ?? $letter->letter_type,
                    $priorityLabels[$letter->priority] ?? $letter->priority,
                    $statusLabels[$letter->final_status] ?? $letter->final_status,
                    $letter->sender_name,
                    $letter->recipient_name,
                    $letter->created_at?->format('Y/m/d H:i'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function exportPdf(Request $request)
    {
        $user = auth()->user();

        if (!$user->can('export-reports')) {
            abort(403);
        }

        $report = $this->reportService->buildReport($user, $request);

        return response()->json([
            'message' => 'خروجی PDF به‌زودی اضافه می‌شود. فعلاً از خروجی Excel استفاده کنید.',
            'overview' => $report['overview'],
        ], 501);
    }
}
