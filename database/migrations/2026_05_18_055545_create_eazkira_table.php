<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tazkiras', function (Blueprint $table) {
            $table->id();

            // ==================== معلومات شخصی ====================
            $table->string('first_name', 100)->comment('نام');
            $table->string('last_name', 100)->comment('تخلص');
            $table->string('father_name', 100)->nullable()->comment('نام پدر');
            $table->string('grandfather_name', 100)->nullable()->comment('نام پدر کلان');

            // ==================== مشخصات تذکره ====================
            $table->string('tazkira_number', 50)->unique()->comment('شماره تذکره');
            $table->string('volume', 20)->nullable()->comment('جلد');
            $table->string('page', 20)->nullable()->comment('صفحه');
            $table->string('registration_number', 50)->nullable()->comment('صکو / شماره ثبت');

            // ==================== اطلاعات تکمیلی (مطابق فرم) ====================
            $table->string('velayat', 100)->nullable()->comment('ولایت');
            $table->string('volosvali', 100)->nullable()->comment('ولسوالی');
            $table->string('qaria', 100)->nullable()->comment('قریه / ناحیه');

            // ==================== تصویر تذکره ====================
            $table->string('tazkira_image', 500)->nullable()->comment('مسیر تصویر تذکره');

            // ==================== وضعیت ====================
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->comment('وضعیت تأیید');
            $table->text('notes')->nullable()->comment('توضیحات');

            // ==================== اطلاعات ثبت ====================
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->comment('ثبت کننده');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->comment('تأیید کننده');
            $table->timestamp('approved_at')->nullable()->comment('زمان تأیید');

            $table->timestamps();
            $table->softDeletes();

            // ==================== ایندکس‌ها ====================
            $table->index('tazkira_number');
            $table->index('status');
            $table->index(['first_name', 'last_name']);
            $table->index('velayat');
            $table->index('volosvali');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tazkiras');
    }
};
