<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Archive;
use App\Models\ArchiveCase;
use App\Models\ArchivePermission;
use App\Models\Department;
use App\Models\Letter;
use App\Models\LetterCategory;
use App\Models\LetterSignature;
use App\Models\Organization;
use App\Models\Position;
use App\Models\Reminder;
use App\Models\Routing;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Morilog\Jalali\Jalalian;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // ── Organizations ──────────────────────────────────────
        $org1 = Organization::firstOrCreate(
            ['code' => 'MOC'],
            [
                'name' => 'وزارت مخابرات و تکنالوژی معلوماتی',
                'email' => 'info@moc.gov.af',
                'phone' => '0202100000',
                'address' => 'کابل، افغانستان',
                'status' => 'active',
            ]
        );

        $org2 = Organization::firstOrCreate(
            ['code' => 'MOF'],
            [
                'name' => 'وزارت مالیه',
                'email' => 'info@mof.gov.af',
                'phone' => '0202200000',
                'address' => 'کابل، افغانستان',
                'status' => 'active',
            ]
        );

        // ── Departments ────────────────────────────────────────
        $deptIt = Department::firstOrCreate(
            ['organization_id' => $org1->id, 'code' => 'IT'],
            [
                'name' => 'ریاست تکنالوژی معلوماتی',
                'status' => 'active',
                'level' => 1,
                'path' => '/IT',
            ]
        );

        $deptHr = Department::firstOrCreate(
            ['organization_id' => $org1->id, 'code' => 'HR'],
            [
                'name' => 'ریاست منابع بشری',
                'status' => 'active',
                'level' => 1,
                'path' => '/HR',
            ]
        );

        $deptFin = Department::firstOrCreate(
            ['organization_id' => $org2->id, 'code' => 'FIN'],
            [
                'name' => 'ریاست بودجه',
                'status' => 'active',
                'level' => 1,
                'path' => '/FIN',
            ]
        );

        // ── Positions ──────────────────────────────────────────
        $posManagerIt = Position::firstOrCreate(
            ['department_id' => $deptIt->id, 'code' => 'IT-MGR'],
            ['name' => 'رئیس تکنالوژی', 'level' => 1, 'is_management' => true]
        );
        $posExpertIt = Position::firstOrCreate(
            ['department_id' => $deptIt->id, 'code' => 'IT-EXP'],
            ['name' => 'کارشناس سیستم', 'level' => 2, 'is_management' => false]
        );
        $posReceptionIt = Position::firstOrCreate(
            ['department_id' => $deptIt->id, 'code' => 'IT-REC'],
            ['name' => 'مسئول دبیرخانه', 'level' => 3, 'is_management' => false]
        );
        $posManagerHr = Position::firstOrCreate(
            ['department_id' => $deptHr->id, 'code' => 'HR-MGR'],
            ['name' => 'رئیس منابع بشری', 'level' => 1, 'is_management' => true]
        );
        $posClerkHr = Position::firstOrCreate(
            ['department_id' => $deptHr->id, 'code' => 'HR-CLK'],
            ['name' => 'کارمند اداری', 'level' => 2, 'is_management' => false]
        );

        // ── Users ──────────────────────────────────────────────
        $orgAdmin = $this->makeUser([
            'email' => 'orgadmin@moc.gov.af',
            'first_name' => 'احمد',
            'last_name' => 'کریمی',
            'national_code' => '2222222222',
            'employment_code' => 'EMP000002',
            'organization_id' => $org1->id,
            'department_id' => $deptIt->id,
            'primary_position_id' => $posManagerIt->id,
            'password' => 'password',
        ], RoleEnum::ORG_ADMIN->value, $posManagerIt);

        $deptManager = $this->makeUser([
            'email' => 'manager@moc.gov.af',
            'first_name' => 'مریم',
            'last_name' => 'احمدی',
            'national_code' => '3333333333',
            'employment_code' => 'EMP000003',
            'organization_id' => $org1->id,
            'department_id' => $deptIt->id,
            'primary_position_id' => $posManagerIt->id,
            'password' => 'password',
        ], RoleEnum::DEPT_MANAGER->value, $posManagerIt);

        $reception = $this->makeUser([
            'email' => 'reception@moc.gov.af',
            'first_name' => 'فرهاد',
            'last_name' => 'نوری',
            'national_code' => '4444444444',
            'employment_code' => 'EMP000004',
            'organization_id' => $org1->id,
            'department_id' => $deptIt->id,
            'primary_position_id' => $posReceptionIt->id,
            'password' => 'password',
        ], RoleEnum::USER->value, $posReceptionIt);

        $expert = $this->makeUser([
            'email' => 'expert@moc.gov.af',
            'first_name' => 'سمیرا',
            'last_name' => 'رحیمی',
            'national_code' => '5555555555',
            'employment_code' => 'EMP000005',
            'organization_id' => $org1->id,
            'department_id' => $deptIt->id,
            'primary_position_id' => $posExpertIt->id,
            'password' => 'password',
        ], RoleEnum::USER->value, $posExpertIt);

        $hrUser = $this->makeUser([
            'email' => 'hr@moc.gov.af',
            'first_name' => 'وحید',
            'last_name' => 'صالحی',
            'national_code' => '6666666666',
            'employment_code' => 'EMP000006',
            'organization_id' => $org1->id,
            'department_id' => $deptHr->id,
            'primary_position_id' => $posClerkHr->id,
            'password' => 'password',
        ], RoleEnum::USER->value, $posClerkHr);

        $deptIt->update([
            'reception_user_id' => $reception->id,
            'manager_position_id' => $posManagerIt->id,
        ]);
        $deptHr->update([
            'manager_position_id' => $posManagerHr->id,
        ]);

        // ── Categories ─────────────────────────────────────────
        $catGeneral = LetterCategory::firstOrCreate(
            ['organization_id' => $org1->id, 'code' => 'GEN'],
            ['name' => 'عمومی', 'color' => '#3b82f6', 'sort_order' => 1, 'status' => true]
        );
        $catUrgent = LetterCategory::firstOrCreate(
            ['organization_id' => $org1->id, 'code' => 'URG'],
            ['name' => 'فوری', 'color' => '#ef4444', 'sort_order' => 2, 'status' => true]
        );
        $catHr = LetterCategory::firstOrCreate(
            ['organization_id' => $org1->id, 'code' => 'HR'],
            ['name' => 'منابع بشری', 'color' => '#10b981', 'sort_order' => 3, 'status' => true]
        );

        // ── Letters ────────────────────────────────────────────
        $letters = [];

        $letters[] = $this->makeLetter([
            'organization_id' => $org1->id,
            'letter_type' => 'internal',
            'letter_number' => 'MOC-1405-001',
            'tracking_number' => 'TRK-1405-001',
            'category_id' => $catGeneral->id,
            'subject' => 'درخواست ارتقای زیرساخت شبکه',
            'summary' => 'نیاز به ارتقای تجهیزات شبکه ریاست تکنالوژی',
            'content' => '<p>به اطلاع می‌رساند که تجهیزات فعلی شبکه نیازمند ارتقا می‌باشد. لطفاً بررسی و اقدام لازم صورت گیرد.</p>',
            'priority' => 'high',
            'security_level' => 'internal',
            'sender_user_id' => $deptManager->id,
            'sender_position_id' => $posManagerIt->id,
            'sender_department_id' => $deptIt->id,
            'sender_name' => $deptManager->full_name,
            'recipient_user_id' => $expert->id,
            'recipient_position_id' => $posExpertIt->id,
            'recipient_department_id' => $deptIt->id,
            'recipient_name' => $expert->full_name,
            'final_status' => 'pending',
            'is_draft' => false,
            'created_by' => $deptManager->id,
            'date' => now()->subDays(3)->toDateString(),
            'due_date' => Jalalian::fromCarbon(Carbon::now()->addDays(4))->format('Y-m-d'),
        ]);

        $letters[] = $this->makeLetter([
            'organization_id' => $org1->id,
            'letter_type' => 'external',
            'letter_number' => 'MOC-1405-002',
            'tracking_number' => 'TRK-1405-002',
            'category_id' => $catUrgent->id,
            'subject' => 'استعلام هماهنگی جلسه بین‌وزارتی',
            'summary' => 'هماهنگی جلسه مشترک با وزارت مالیه',
            'content' => '<p>احتراماً، خواهشمند است زمان مناسب برای جلسه هماهنگی اعلام گردد.</p>',
            'priority' => 'urgent',
            'security_level' => 'confidential',
            'sender_user_id' => $orgAdmin->id,
            'sender_position_id' => $posManagerIt->id,
            'sender_department_id' => $deptIt->id,
            'sender_name' => $orgAdmin->full_name,
            'recipient_organization_id' => $org2->id,
            'recipient_department_id' => $deptFin->id,
            'recipient_name' => 'وزارت مالیه',
            'final_status' => 'pending',
            'is_draft' => false,
            'created_by' => $orgAdmin->id,
            'date' => now()->subDays(1)->toDateString(),
            'due_date' => Jalalian::fromCarbon(Carbon::now()->addDays(2))->format('Y-m-d'),
        ]);

        $letters[] = $this->makeLetter([
            'organization_id' => $org1->id,
            'letter_type' => 'internal',
            'letter_number' => 'MOC-1405-003',
            'tracking_number' => 'TRK-1405-003',
            'category_id' => $catHr->id,
            'subject' => 'درخواست مرخصی کارمند',
            'summary' => 'مرخصی استحقاقی ۱۰ روزه',
            'content' => '<p>با سلام، درخواست مرخصی استحقاقی به مدت ۱۰ روز تقدیم می‌گردد.</p>',
            'priority' => 'normal',
            'security_level' => 'internal',
            'sender_user_id' => $hrUser->id,
            'sender_position_id' => $posClerkHr->id,
            'sender_department_id' => $deptHr->id,
            'sender_name' => $hrUser->full_name,
            'recipient_user_id' => $reception->id,
            'recipient_position_id' => $posReceptionIt->id,
            'recipient_department_id' => $deptIt->id,
            'recipient_name' => $reception->full_name,
            'final_status' => 'pending',
            'is_draft' => false,
            'created_by' => $hrUser->id,
            'date' => now()->toDateString(),
        ]);

        $letters[] = $this->makeLetter([
            'organization_id' => $org1->id,
            'letter_type' => 'internal',
            'letter_number' => 'MOC-1405-004',
            'tracking_number' => 'TRK-1405-004',
            'category_id' => $catGeneral->id,
            'subject' => 'پیش‌نویس گزارش ماهانه',
            'summary' => 'پیش‌نویس گزارش عملکرد ماه حمل',
            'content' => '<p>پیش‌نویس گزارش ماهانه جهت بررسی.</p>',
            'priority' => 'low',
            'security_level' => 'internal',
            'sender_user_id' => $expert->id,
            'sender_department_id' => $deptIt->id,
            'sender_name' => $expert->full_name,
            'recipient_user_id' => $deptManager->id,
            'recipient_department_id' => $deptIt->id,
            'recipient_name' => $deptManager->full_name,
            'final_status' => 'draft',
            'is_draft' => true,
            'created_by' => $expert->id,
            'date' => now()->toDateString(),
        ]);

        $letters[] = $this->makeLetter([
            'organization_id' => $org1->id,
            'letter_type' => 'internal',
            'letter_number' => 'MOC-1405-005',
            'tracking_number' => 'TRK-1405-005',
            'category_id' => $catGeneral->id,
            'subject' => 'تأیید نهایی طرح امنیتی',
            'summary' => 'طرح امنیتی اطلاعات سازمان',
            'content' => '<p>طرح امنیتی پس از بررسی تأیید گردید.</p>',
            'priority' => 'high',
            'security_level' => 'secret',
            'sender_user_id' => $deptManager->id,
            'sender_department_id' => $deptIt->id,
            'sender_name' => $deptManager->full_name,
            'recipient_user_id' => $orgAdmin->id,
            'recipient_department_id' => $deptIt->id,
            'recipient_name' => $orgAdmin->full_name,
            'final_status' => 'approved',
            'is_draft' => false,
            'created_by' => $deptManager->id,
            'date' => now()->subDays(10)->toDateString(),
        ]);

        // ── Routings (including overdue) ───────────────────────
        Routing::firstOrCreate(
            [
                'letter_id' => $letters[0]->id,
                'to_user_id' => $expert->id,
                'step_order' => 1,
            ],
            [
                'from_user_id' => $deptManager->id,
                'from_position_id' => $posManagerIt->id,
                'to_position_id' => $posExpertIt->id,
                'action_type' => 'action',
                'instruction' => 'لطفاً پیشنهاد تخنیکی ارائه دهید.',
                'deadline' => now()->subDays(1),
                'status' => 'pending',
                'priority' => 2,
                'is_reception' => false,
            ]
        );

        Routing::firstOrCreate(
            [
                'letter_id' => $letters[2]->id,
                'to_user_id' => $reception->id,
                'step_order' => 1,
            ],
            [
                'from_user_id' => $hrUser->id,
                'from_position_id' => $posClerkHr->id,
                'to_position_id' => $posReceptionIt->id,
                'action_type' => 'action',
                'instruction' => 'ثبت و ارجاع به واحد مربوطه',
                'deadline' => now()->addDays(2),
                'status' => 'pending',
                'priority' => 1,
                'is_reception' => true,
            ]
        );

        // Pending reminder for overdue routing test
        Reminder::firstOrCreate(
            [
                'letter_id' => $letters[0]->id,
                'user_id' => $expert->id,
                'reminder_type' => 'deadline',
                'reminder_date' => now()->subHour(),
            ],
            [
                'routing_id' => Routing::where('letter_id', $letters[0]->id)->value('id'),
                'message' => 'مهلت اقدام برای مکتوب درخواست ارتقای زیرساخت شبکه گذشته است.',
                'status' => 'pending',
                'is_sent' => false,
                'created_by' => $deptManager->id,
            ]
        );

        // Signature on approved letter
        LetterSignature::firstOrCreate(
            [
                'letter_id' => $letters[4]->id,
                'user_id' => $deptManager->id,
            ],
            [
                'signature_type' => 'electronic',
                'signature_data' => $deptManager->full_name,
                'signed_at' => now()->subDays(9),
                'verified_at' => now()->subDays(9),
                'verified_by' => $deptManager->id,
                'verification_result' => true,
            ]
        );

        // ── Archives ───────────────────────────────────────────
        $archive = Archive::firstOrCreate(
            ['department_id' => $deptIt->id, 'code' => 'ARC-IT-01'],
            [
                'name' => 'آرشیف مرکزی تکنالوژی',
                'description' => 'بایگانی اسناد و مکاتیب ریاست تکنالوژی',
                'location' => 'طبقه دوم، اتاق ۱۰۲',
                'is_active' => true,
            ]
        );

        ArchiveCase::firstOrCreate(
            ['archive_id' => $archive->id, 'case_number' => 'CASE-1405-001'],
            [
                'title' => 'پرونده زیرساخت شبکه ۱۴۰۵',
                'description' => 'اسناد مرتبط با ارتقای شبکه',
                'retention_period' => 5,
                'retention_unit' => 'years',
                'is_active' => true,
                'created_by' => $deptManager->id,
            ]
        );

        ArchivePermission::firstOrCreate(
            [
                'archive_id' => $archive->id,
                'position_id' => $posExpertIt->id,
                'permission_type' => 'read',
            ]
        );
        ArchivePermission::firstOrCreate(
            [
                'archive_id' => $archive->id,
                'position_id' => $posManagerIt->id,
                'permission_type' => 'manage',
            ]
        );

        $this->command?->info('Demo data seeded successfully.');
        $this->command?->table(
            ['Role / User', 'Email', 'Password'],
            [
                ['Super Admin', 'superadmin@system.com', 'password'],
                ['Org Admin', 'orgadmin@moc.gov.af', 'password'],
                ['Dept Manager', 'manager@moc.gov.af', 'password'],
                ['Reception', 'reception@moc.gov.af', 'password'],
                ['Expert', 'expert@moc.gov.af', 'password'],
                ['HR User', 'hr@moc.gov.af', 'password'],
            ]
        );
    }

    private function makeUser(array $attrs, string $role, Position $position): User
    {
        $user = User::firstOrCreate(
            ['email' => $attrs['email']],
            array_merge($attrs, [
                'status' => 'active',
                'email_verified_at' => now(),
                'security_clearance' => 'internal',
                'locale' => 'fa',
                'timezone' => 'Asia/Kabul',
                'preferred_font' => 'Vazirmatn',
                'mobile' => '070' . random_int(1000000, 9999999),
            ])
        );

        if (! $user->hasRole($role)) {
            $user->assignRole($role);
        }

        if (! $user->positions()->where('position_id', $position->id)->exists()) {
            $user->positions()->attach($position->id, [
                'is_primary' => true,
                'start_date' => now()->subYear()->toDateString(),
                'status' => 'active',
            ]);
        }

        return $user;
    }

    private function makeLetter(array $attrs): Letter
    {
        return Letter::firstOrCreate(
            ['letter_number' => $attrs['letter_number']],
            array_merge([
                'thread_id' => (string) Str::uuid(),
                'sheet_count' => 1,
                'is_public' => false,
                'is_follow_up' => false,
                'follow_up_count' => 0,
                'follow_up_status' => 'pending',
            ], $attrs)
        );
    }
}
