<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // اطلاعات سازمانی
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('primary_position_id')->nullable()->constrained('positions')->onDelete('set null');
            
            // اطلاعات احراز هویت
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            
            // اطلاعات شخصی
            $table->string('first_name');
            $table->string('last_name');
            $table->string('national_code', 10)->unique();
            $table->string('mobile', 20)->nullable();
            $table->string('employment_code', 50)->unique()->nullable();
            $table->string('avatar')->nullable();
            
            // اطلاعات اضافی
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('birth_date')->nullable();
            $table->string('emergency_phone', 20)->nullable();
            $table->text('address')->nullable();
            
            // وضعیت کاربر
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending'])->default('pending');
            
            // Two-Factor Authentication
            $table->string('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            
            // زمان آخرین فعالیت
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->timestamp('last_activity_at')->nullable();
            
            // ایمیل
            $table->timestamp('email_verified_at')->nullable();
            
            // حساسیت (برای نامه‌های محرمانه)
            $table->enum('security_clearance', ['public', 'internal', 'confidential', 'secret'])->default('internal');
            
            // تنظیمات کاربر
            $table->json('preferences')->nullable(); // theme, language, notifications, etc.
            $table->string('locale', 10)->default('fa');
            $table->string('timezone', 50)->default('Asia/Tehran');
            
            $table->timestamps();
            $table->softDeletes();
            
            // ایندکس‌ها
            $table->index(['organization_id', 'status']);
            $table->index(['department_id', 'status']);
            $table->index(['first_name', 'last_name']);
            $table->index('national_code');
            $table->index('employment_code');
            $table->index('last_login_at');
            $table->index('security_clearance');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};