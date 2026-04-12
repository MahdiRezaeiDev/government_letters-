<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Morilog\Jalali\Jalalian;

class ReportController extends Controller
{
    /**
     * نمایش صفحه گزارشات
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // ============================================
        // کوئری پایه بر اساس سطح دسترسی
        // ============================================
        
        $lettersQuery = Letter::query();
        
        if (!$user->isSuperAdmin()) {
            if ($user->isOrgAdmin()) {
                $lettersQuery->where('organization_id', $user->organization_id);
            } elseif ($user->isDeptManager()) {
                $lettersQuery->where(function ($q) use ($user) {
                    $q->where('sender_department_id', $user->department_id)
                      ->orWhere('recipient_department_id', $user->department_id);
                });
            } else {
                $lettersQuery->where('created_by', $user->id);
            }
        }
        
        // فیلتر بر اساس تاریخ (اگر ارسال شده باشد)
        if ($request->has('date_from') && $request->date_from) {
            $fromDate = Jalalian::fromFormat('Y/m/d', $request->date_from)->toCarbon();
            $lettersQuery->whereDate('date', '>=', $fromDate);
        }
        
        if ($request->has('date_to') && $request->date_to) {
            $toDate = Jalalian::fromFormat('Y/m/d', $request->date_to)->toCarbon();
            $lettersQuery->whereDate('date', '<=', $toDate);
        }
        
        // فیلتر بر اساس نوع نامه
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $lettersQuery->where('letter_type', $request->type);
        }
        
        // ============================================
        // آمار کلی
        // ============================================
        
        $stats = [
            // آمار پایه
            'total_letters' => (clone $lettersQuery)->count(),
            'incoming_count' => (clone $lettersQuery)->where('letter_type', 'incoming')->count(),
            'outgoing_count' => (clone $lettersQuery)->where('letter_type', 'outgoing')->count(),
            'internal_count' => (clone $lettersQuery)->where('letter_type', 'internal')->count(),
            
            // آمار وضعیت
            'approved_count' => (clone $lettersQuery)->where('final_status', 'approved')->count(),
            'rejected_count' => (clone $lettersQuery)->where('final_status', 'rejected')->count(),
            'pending_count' => (clone $lettersQuery)->where('final_status', 'pending')->count(),
            'archived_count' => (clone $lettersQuery)->where('final_status', 'archived')->count(),
            
            // آمار ماهیانه (۶ ماه اخیر)
            'monthly_stats' => $this->getMonthlyStats($lettersQuery),
            
            // آمار بر اساس دپارتمان
            'department_stats' => $this->getDepartmentStats($lettersQuery, $user),
            
            // آمار بر اساس اولویت
            'priority_stats' => $this->getPriorityStats($lettersQuery),
        ];
        
        return Inertia::render('reports/index', [
            'stats' => $stats,
            'filters' => $request->only(['date_from', 'date_to', 'type']),
        ]);
    }
    
    /**
     * خروجی Excel
     */
    public function exportExcel(Request $request)
    {
        $letters = $this->getFilteredLetters($request);
        
        // استفاده از Maatwebsite Excel
        // return Excel::download(new LettersExport($letters), 'letters.xlsx');
        
        // موقتاً به صورت JSON برگردان (برای تست)
        return response()->json([
            'message' => 'خروجی Excel در حال توسعه است',
            'count' => $letters->count(),
        ]);
    }
    
    /**
     * خروجی PDF
     */
    public function exportPdf(Request $request)
    {
        $letters = $this->getFilteredLetters($request);
        
        // استفاده از DomPDF
        // $pdf = Pdf::loadView('reports.letters', ['letters' => $letters]);
        // return $pdf->download('letters.pdf');
        
        // موقتاً به صورت JSON برگردان (برای تست)
        return response()->json([
            'message' => 'خروجی PDF در حال توسعه است',
            'count' => $letters->count(),
        ]);
    }
    
    // ============================================
    // متدهای کمکی
    // ============================================
    
    /**
     * دریافت آمار ماهیانه
     */
    private function getMonthlyStats($query): array
    {
        $months = [];
        $jalaliMonths = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $jalali = Jalalian::fromCarbon($date);
            $monthName = $jalaliMonths[$jalali->getMonth() - 1];
            
            $count = (clone $query)
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            
            $months[] = [
                'month' => $monthName,
                'count' => $count,
            ];
        }
        
        return $months;
    }
    
    /**
     * دریافت آمار بر اساس دپارتمان
     */
    private function getDepartmentStats($query, $user): array
    {
        $departmentsQuery = Department::query();
        
        if (!$user->isSuperAdmin()) {
            if ($user->isOrgAdmin()) {
                $departmentsQuery->where('organization_id', $user->organization_id);
            } elseif ($user->isDeptManager()) {
                $departmentsQuery->where('id', $user->department_id);
            }
        }
        
        $departments = $departmentsQuery->limit(10)->get();
        $stats = [];
        
        foreach ($departments as $department) {
            $count = (clone $query)
                ->where(function ($q) use ($department) {
                    $q->where('sender_department_id', $department->id)
                      ->orWhere('recipient_department_id', $department->id);
                })
                ->count();
            
            if ($count > 0) {
                $stats[] = [
                    'department' => $department->name,
                    'count' => $count,
                ];
            }
        }
        
        // مرتب‌سازی نزولی و گرفتن ۱۰ تای اول
        usort($stats, fn($a, $b) => $b['count'] - $a['count']);
        return array_slice($stats, 0, 10);
    }
    
    /**
     * دریافت آمار بر اساس اولویت
     */
    private function getPriorityStats($query): array
    {
        $priorities = ['low', 'normal', 'high', 'urgent', 'very_urgent'];
        $stats = [];
        
        foreach ($priorities as $priority) {
            $count = (clone $query)->where('priority', $priority)->count();
            if ($count > 0) {
                $stats[$priority] = $count;
            }
        }
        
        return $stats;
    }
    
    /**
     * دریافت نامه‌های فیلتر شده برای خروجی
     */
    private function getFilteredLetters(Request $request)
    {
        $user = auth()->user();
        $query = Letter::with(['senderDepartment', 'recipientDepartment', 'category']);
        
        if (!$user->isSuperAdmin()) {
            if ($user->isOrgAdmin()) {
                $query->where('organization_id', $user->organization_id);
            } elseif ($user->isDeptManager()) {
                $query->where(function ($q) use ($user) {
                    $q->where('sender_department_id', $user->department_id)
                      ->orWhere('recipient_department_id', $user->department_id);
                });
            } else {
                $query->where('created_by', $user->id);
            }
        }
        
        if ($request->has('date_from') && $request->date_from) {
            $fromDate = Jalalian::fromFormat('Y/m/d', $request->date_from)->toCarbon();
            $query->whereDate('date', '>=', $fromDate);
        }
        
        if ($request->has('date_to') && $request->date_to) {
            $toDate = Jalalian::fromFormat('Y/m/d', $request->date_to)->toCarbon();
            $query->whereDate('date', '<=', $toDate);
        }
        
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('letter_type', $request->type);
        }
        
        return $query->orderBy('date', 'desc')->get();
    }
}