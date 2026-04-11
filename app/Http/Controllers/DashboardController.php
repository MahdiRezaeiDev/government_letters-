<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\User;
use App\Models\Department;
use App\Models\Routing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // آمار کلی
        $stats = [
            // نامه‌های در انتظار اقدام (کارتابل)
            'pending_actions' => Routing::where('to_user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            
            // نامه‌های وارده جدید
            'incoming_new' => Letter::where('recipient_user_id', $user->id)
                ->where('final_status', 'pending')
                ->where('letter_type', 'incoming')
                ->count(),
            
            // نامه‌های صادره جدید
            'outgoing_new' => Letter::where('sender_user_id', $user->id)
                ->where('final_status', 'pending')
                ->where('letter_type', 'outgoing')
                ->count(),
            
            // پیش‌نویس‌های من
            'my_drafts' => Letter::where('created_by', $user->id)
                ->where('is_draft', true)
                ->count(),
            
            // کل نامه‌ها (بر اساس سطح دسترسی)
            'total_letters' => $this->getTotalLetters($user),
            
            // کل کاربران (بر اساس سطح دسترسی)
            'total_users' => $this->getTotalUsers($user),
            
            // کل دپارتمان‌ها (بر اساس سطح دسترسی)
            'total_departments' => $this->getTotalDepartments($user),
            
            // نامه‌های بایگانی شده
            'archived_count' => $this->getArchivedCount($user),
        ];
        
        // نامه‌های اخیر
        $recentLetters = Letter::query()
            ->when(!$user->isSuperAdmin(), function ($query) use ($user) {
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
            })
            ->with(['category', 'senderDepartment', 'recipientDepartment'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($letter) => [
                'id' => $letter->id,
                'subject' => $letter->subject,
                'letter_number' => $letter->letter_number,
                'priority' => $letter->priority,
                'final_status' => $letter->final_status,
                'created_at' => $letter->created_at,
            ]);
        
        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentLetters' => $recentLetters,
        ]);
    }
    
    private function getTotalLetters($user): int
    {
        $query = Letter::query();
        
        if ($user->isSuperAdmin()) {
            return $query->count();
        }
        
        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }
        
        if ($user->isDeptManager()) {
            return $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                  ->orWhere('recipient_department_id', $user->department_id);
            })->count();
        }
        
        return $query->where('created_by', $user->id)->count();
    }
    
    private function getTotalUsers($user): int
    {
        $query = User::query();
        
        if ($user->isSuperAdmin()) {
            return $query->count();
        }
        
        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }
        
        if ($user->isDeptManager()) {
            return $query->where('department_id', $user->department_id)->count();
        }
        
        return 1; // فقط خودش
    }
    
    private function getTotalDepartments($user): int
    {
        $query = Department::query();
        
        if ($user->isSuperAdmin()) {
            return $query->count();
        }
        
        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }
        
        if ($user->isDeptManager()) {
            return $query->where('id', $user->department_id)->count();
        }
        
        return 0;
    }
    
    private function getArchivedCount($user): int
    {
        $query = Letter::where('final_status', 'archived');
        
        if ($user->isSuperAdmin()) {
            return $query->count();
        }
        
        if ($user->isOrgAdmin()) {
            return $query->where('organization_id', $user->organization_id)->count();
        }
        
        if ($user->isDeptManager()) {
            return $query->where(function ($q) use ($user) {
                $q->where('sender_department_id', $user->department_id)
                  ->orWhere('recipient_department_id', $user->department_id);
            })->count();
        }
        
        return $query->where('created_by', $user->id)->count();
    }
}