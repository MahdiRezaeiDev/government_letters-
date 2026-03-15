<?php

return [
    /*
    |--------------------------------------------------------------------------
    | تنظیمات سیستم مکاتبات اداری
    |--------------------------------------------------------------------------
    */

    'app_name' => 'سیستم مکاتبات اداری',
    'version'  => '1.0.0',

    // الگوی شماره‌گذاری نامه‌ها: {type}/{year}/{month}/{sequence}
    'letter_numbering' => [
        'padding'       => 5,
        'reset_yearly'  => true,
    ],

    // سطوح امنیت
    'security_levels' => [
        'public'       => 'عمومی',
        'internal'     => 'داخلی',
        'confidential' => 'محرمانه',
        'secret'       => 'سری',
        'top_secret'   => 'بسیار سری',
    ],

    // اولویت‌ها
    'priorities' => [
        'low'        => 'کم',
        'normal'     => 'عادی',
        'high'       => 'مهم',
        'urgent'     => 'فوری',
        'very_urgent'=> 'خیلی فوری',
    ],

    // انواع نامه
    'letter_types' => [
        'incoming' => 'وارده',
        'outgoing' => 'صادره',
        'internal' => 'داخلی',
    ],

    // گردش کار
    'workflow' => [
        'default_deadline_days' => 7,
        'reminder_before_days'  => 2,
        'max_parallel_actions'  => 5,
    ],

    // آپلود فایل
    'upload' => [
        'max_file_size'        => 10240, // KB
        'allowed_mimes'        => ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
        'max_files_per_letter' => 10,
    ],
];
