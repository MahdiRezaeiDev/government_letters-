<?php

return [
    'app_name' => 'سیستم مکاتبات اداری',
    'version' => '1.0.0',
    
    'letter_numbering' => [
        'pattern' => env('LETTER_NUMBER_PATTERN', '{type}/{year}/{month}/{sequence}'),
        'separator' => '/',
        'padding' => 5,
        'reset_yearly' => true,
    ],
    
    'security_levels' => [
        'public' => 'عمومی',
        'internal' => 'داخلی',
        'confidential' => 'محرمانه',
        'secret' => 'سری',
        'top_secret' => 'بسیار سری',
    ],
    
    'priority_levels' => [
        'low' => 'کم',
        'normal' => 'عادی',
        'high' => 'مهم',
        'urgent' => 'فوری',
        'very_urgent' => 'خیلی فوری',
    ],
    
    'letter_types' => [
        'incoming' => 'وارده',
        'outgoing' => 'صادره',
        'internal' => 'داخلی',
    ],
    
    'workflow' => [
        'default_deadline_days' => 7,
        'reminder_before_days' => 2,
        'max_parallel_actions' => 5,
    ],
    
    'archive' => [
        'retention_periods' => [
            'temporary' => 30, // days
            'permanent' => null,
            'confidential' => 365,
        ],
    ],
    
    'upload' => [
        'max_file_size' => 10240, // KB
        'allowed_mimes' => ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
        'max_files_per_letter' => 10,
    ],
];