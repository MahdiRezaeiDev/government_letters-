<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * نمایش صفحه تنظیمات سیستم
     */
    public function index()
    {
        $user = auth()->user();
        
        // فقط ادمین کل می‌تواند تنظیمات را ببیند
        if (!$user->isSuperAdmin()) {
            abort(403);
        }
        
        // دریافت تنظیمات سازمان (اگر کاربر سازمان دارد)
        $settings = SystemSetting::where('organization_id', $user->organization_id)
            ->orWhereNull('organization_id')
            ->get()
            ->groupBy('group');
        
        // تنظیمات پیش‌فرض
        $defaultSettings = [
            'general' => [
                'app_name' => config('app.name'),
                'app_locale' => config('app.locale'),
                'app_timezone' => config('app.timezone'),
                'items_per_page' => 15,
            ],
            'mail' => [
                'mail_host' => config('mail.mailers.smtp.host'),
                'mail_port' => config('mail.mailers.smtp.port'),
                'mail_username' => config('mail.mailers.smtp.username'),
                'mail_encryption' => config('mail.mailers.smtp.encryption'),
                'mail_from_address' => config('mail.from.address'),
                'mail_from_name' => config('mail.from.name'),
            ],
            'security' => [
                'two_factor_enabled' => false,
                'session_lifetime' => config('session.lifetime'),
                'password_expiry_days' => 90,
                'max_login_attempts' => 5,
            ],
            'upload' => [
                'max_file_size' => 10240,
                'allowed_file_types' => 'pdf,doc,docx,jpg,png',
                'max_files_per_letter' => 10,
            ],
            'letter' => [
                'default_deadline_days' => 7,
                'auto_archive_days' => 365,
                'reminder_before_days' => 2,
            ],
        ];
        
        return Inertia::render('settings/index', [
            'settings' => $settings,
            'defaultSettings' => $defaultSettings,
            'locales' => [
                'fa' => 'فارسی',
                'en' => 'English',
            ],
            'timezones' => [
                'Asia/Tehran' => 'تهران',
                'Asia/Dubai' => 'دبی',
                'UTC' => 'UTC',
            ],
        ]);
    }
    
    /**
     * به‌روزرسانی تنظیمات
     */
    public function update(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->isSuperAdmin()) {
            abort(403);
        }
        
        $validator = Validator::make($request->all(), [
            // تنظیمات عمومی
            'app_name' => 'nullable|string|max:255',
            'app_locale' => 'nullable|in:fa,en',
            'app_timezone' => 'nullable|timezone',
            'items_per_page' => 'nullable|integer|min:5|max:100',
            
            // تنظیمات ایمیل
            'mail_host' => 'nullable|string|max:255',
            'mail_port' => 'nullable|integer|min:1|max:65535',
            'mail_username' => 'nullable|string|max:255',
            'mail_password' => 'nullable|string|max:255',
            'mail_encryption' => 'nullable|in:tls,ssl',
            'mail_from_address' => 'nullable|email',
            'mail_from_name' => 'nullable|string|max:255',
            
            // تنظیمات امنیتی
            'two_factor_enabled' => 'nullable|boolean',
            'session_lifetime' => 'nullable|integer|min:5|max:720',
            'password_expiry_days' => 'nullable|integer|min:0|max:365',
            'max_login_attempts' => 'nullable|integer|min:1|max:20',
            
            // تنظیمات آپلود
            'max_file_size' => 'nullable|integer|min:100|max:51200',
            'allowed_file_types' => 'nullable|string|max:255',
            'max_files_per_letter' => 'nullable|integer|min:1|max:20',
            
            // تنظیمات نامه
            'default_deadline_days' => 'nullable|integer|min:1|max:30',
            'auto_archive_days' => 'nullable|integer|min:30|max:730',
            'reminder_before_days' => 'nullable|integer|min:0|max:7',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // ذخیره تنظیمات
        $this->saveSetting('general', 'app_name', $request->app_name);
        $this->saveSetting('general', 'app_locale', $request->app_locale);
        $this->saveSetting('general', 'app_timezone', $request->app_timezone);
        $this->saveSetting('general', 'items_per_page', $request->items_per_page);
        
        $this->saveSetting('mail', 'mail_host', $request->mail_host);
        $this->saveSetting('mail', 'mail_port', $request->mail_port);
        $this->saveSetting('mail', 'mail_username', $request->mail_username);
        $this->saveSetting('mail', 'mail_encryption', $request->mail_encryption);
        $this->saveSetting('mail', 'mail_from_address', $request->mail_from_address);
        $this->saveSetting('mail', 'mail_from_name', $request->mail_from_name);
        
        // رمز عبور ایمیل را جداگانه ذخیره می‌کنیم (اگر پر شده باشد)
        if ($request->filled('mail_password')) {
            $this->saveSetting('mail', 'mail_password', encrypt($request->mail_password));
        }
        
        $this->saveSetting('security', 'two_factor_enabled', $request->two_factor_enabled);
        $this->saveSetting('security', 'session_lifetime', $request->session_lifetime);
        $this->saveSetting('security', 'password_expiry_days', $request->password_expiry_days);
        $this->saveSetting('security', 'max_login_attempts', $request->max_login_attempts);
        
        $this->saveSetting('upload', 'max_file_size', $request->max_file_size);
        $this->saveSetting('upload', 'allowed_file_types', $request->allowed_file_types);
        $this->saveSetting('upload', 'max_files_per_letter', $request->max_files_per_letter);
        
        $this->saveSetting('letter', 'default_deadline_days', $request->default_deadline_days);
        $this->saveSetting('letter', 'auto_archive_days', $request->auto_archive_days);
        $this->saveSetting('letter', 'reminder_before_days', $request->reminder_before_days);
        
        return redirect()->route('settings.index')
            ->with('success', 'تنظیمات با موفقیت ذخیره شد.');
    }
    
    /**
     * ذخیره یک تنظیم در دیتابیس
     */
    private function saveSetting(string $group, string $key, $value): void
    {
        if ($value === null) return;
        
        $user = auth()->user();
        
        SystemSetting::updateOrCreate(
            [
                'organization_id' => $user->organization_id,
                'group' => $group,
                'key' => $key,
            ],
            [
                'value' => is_bool($value) ? ($value ? '1' : '0') : (string) $value,
                'type' => $this->getValueType($value),
            ]
        );
    }
    
    /**
     * تشخیص نوع مقدار
     */
    private function getValueType($value): string
    {
        if (is_bool($value)) return 'boolean';
        if (is_numeric($value)) return 'number';
        if (is_array($value)) return 'json';
        return 'text';
    }
}