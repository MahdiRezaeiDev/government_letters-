<?php
// app/Http/Controllers/Api/ReportController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService
    ) {}

    public function letterStats(Request $request): JsonResponse
    {
        $this->authorize('report.view');

        $orgId = auth()->user()->organization_id;
        $from  = Carbon::parse($request->get('from', now()->startOfMonth()));
        $to    = Carbon::parse($request->get('to', now()));

        $stats = $this->reportService->getLetterStats($orgId, $from, $to);

        return response()->json(['data' => $stats]);
    }

    public function userPerformance(Request $request): JsonResponse
    {
        $this->authorize('report.view');

        $orgId = auth()->user()->organization_id;
        $from  = Carbon::parse($request->get('from', now()->startOfMonth()));
        $to    = Carbon::parse($request->get('to', now()));

        return response()->json([
            'data' => $this->reportService->getUserPerformance($orgId, $from, $to)
        ]);
    }

    public function overdueLetters(): JsonResponse
    {
        $this->authorize('report.view');

        return response()->json([
            'data' => $this->reportService->getOverdueLetters(auth()->user()->organization_id)
        ]);
    }
}