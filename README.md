# سیستم مکاتیب اداری

سامانه مدیریت مکاتبات دولتی بر پایه Laravel + Inertia + React.

## نیازمندی‌ها

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL

## نصب سریع

```bash
composer install
cp .env.example .env
php artisan key:generate
# تنظیم DB_* در .env
php artisan migrate --seed
npm install
npm run build
php artisan storage:link
```

کاربر پیش‌فرض پس از seed:

- ایمیل: `superadmin@system.com`
- رمز: `password`

## اجرای محیط توسعه

```bash
# ترمینال ۱ — اپلیکیشن، صف، Vite
composer dev

# ترمینال ۲ — WebSocket برای نوتیفیکیشن realtime
php artisan reverb:start

# ترمینال ۳ — زمان‌بندی یادآوری مهلت‌ها (اختیاری در لوکال)
php artisan schedule:work
```

یا فقط:

```bash
php artisan serve
npm run dev
php artisan queue:work
php artisan reverb:start
```

## ویژگی‌های کلیدی

- مکاتیب وارده/صادره/داخلی، کارتابل، دبیرخانه
- ارجاع، تفویض پاسخ، امضا
- آرشیف و پرونده + مدیریت دسترسی بایگانی
- گزارشات Excel/PDF
- تذکره (NID)
- نوتیفیکیشن دیتابیس + Reverb
- یادآوری خودکار مهلت ارجاع (`reminders:send-deadlines` هر ساعت)

## نقش‌ها

| نقش | توضیح |
|-----|--------|
| `super-admin` | ادمین کل |
| `org-admin` | ادمین سازمان |
| `dept-manager` | مدیر ریاست |
| `user` | کاربر عادی |

## نکات دیپلوی سرور

1. `BROADCAST_CONNECTION=reverb` و مقادیر `REVERB_*` / `VITE_REVERB_*` را با دامنه واقعی سرور تنظیم کنید (نه `localhost`).
2. پس از تغییر `VITE_*` حتماً `npm run build` بزنید.
3. سرویس‌های پایدار لازم: `queue:work`، `reverb:start`، `schedule:work` (یا Task Scheduler ویندوز برای `php artisan schedule:run`).
4. برای HTTPS باید WebSocket روی `wss` پروکسی شود.
