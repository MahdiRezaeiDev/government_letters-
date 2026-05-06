<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            // ==================== اضافه کردن فیلدهای ارجاع برای پاسخ ====================
            
            // شخصی که مکتوب به او ارجاع شده (برای پاسخ)
            $table->foreignId('delegated_to_user_id')
                ->nullable()
                ->after('recipient_organization_id')
                ->constrained('users')
                ->onDelete('set null')
                ->comment('شخصی که مکتوب به او ارجاع شده تا پاسخ دهد');
            
            // شخصی که ارجاع را انجام داده
            $table->foreignId('delegated_by_user_id')
                ->nullable()
                ->after('delegated_to_user_id')
                ->constrained('users')
                ->onDelete('set null')
                ->comment('شخصی که مکتوب را ارجاع داده است');
            
            // زمان ارجاع
            $table->timestamp('delegated_at')
                ->nullable()
                ->after('delegated_by_user_id')
                ->comment('زمان ارجاع مکتوب');
            
            // ==================== اضافه کردن وضعیت جدید به enum ====================
            // توجه: برای تغییر enum باید از دستور زیر استفاده کرد
            // ابتدا enum قدیمی را حذف و دوباره با مقدار جدید ایجاد می‌کنیم
            DB::statement("ALTER TABLE letters MODIFY COLUMN final_status ENUM('draft', 'pending', 'approved', 'rejected', 'archived', 'delegated') DEFAULT 'draft'");
        });
    }

    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            // حذف فیلدهای ارجاع
            $table->dropForeign(['delegated_to_user_id']);
            $table->dropForeign(['delegated_by_user_id']);
            $table->dropColumn(['delegated_to_user_id', 'delegated_by_user_id', 'delegated_at']);
            
            // برگرداندن enum به حالت قبلی
            DB::statement("ALTER TABLE letters MODIFY COLUMN final_status ENUM('draft', 'pending', 'approved', 'rejected', 'archived') DEFAULT 'draft'");
        });
    }
};