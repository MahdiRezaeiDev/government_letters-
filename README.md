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
- بک‌آپ روزانه دیتابیس + فایل‌های آپلود (`backup:run`)

## نقش‌ها

| نقش | توضیح |
|-----|--------|
| `super-admin` | ادمین کل |
| `org-admin` | ادمین سازمان |
| `dept-manager` | مدیر ریاست |
| `user` | کاربر عادی |

## بک‌آپ (دیتابیس + آپلودها)

پکیج `spatie/laravel-backup` فعال است و این‌ها را بک‌آپ می‌گیرد:

- دیتابیس MySQL
- فایل‌های آپلود در `storage/app/public`

خروجی در `storage/app/backups` ذخیره می‌شود.

```bash
# بک‌آپ دستی
php artisan backup:run

# فقط دیتابیس
php artisan backup:run --only-db

# فقط فایل‌ها
php artisan backup:run --only-files
```

زمان‌بندی خودکار (با `schedule:work` یا کرون/`schedule:run`):

- `01:00` — پاک‌سازی بک‌آپ‌های قدیمی (`backup:clean`)
- `01:30` — بک‌آپ جدید (`backup:run`)
- `02:00` — مانیتور سلامت (`backup:monitor`)

روی ویندوز اگر `mysqldump` در PATH نباشد، در `.env` تنظیم کنید:

```env
DB_DUMP_BINARY_PATH=C:\xampp\mysql\bin
```

## نکات دیپلوی سرور

1. `BROADCAST_CONNECTION=reverb` و مقادیر `REVERB_*` / `VITE_REVERB_*` را با دامنه واقعی سرور تنظیم کنید (نه `localhost`).
2. پس از تغییر `VITE_*` حتماً `npm run build` بزنید.
3. سرویس‌های پایدار لازم: `queue:work`، `reverb:start`، `schedule:work` (یا Task Scheduler ویندوز برای `php artisan schedule:run`).
4. برای HTTPS باید WebSocket روی `wss` پروکسی شود.
5. پوشه `storage/app/backups` را از وب‌روت خارج نگه دارید و ترجیحاً کپی خارجی هم بگیرید.
