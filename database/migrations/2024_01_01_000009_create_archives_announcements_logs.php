<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ایجاد جداول بایگانی، اطلاعیه‌ها، لاگ رویدادها
     */
    public function up(): void
    {
        // بایگانی‌ها
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('archives')->nullOnDelete();
            $table->text('description')->nullable();
            $table->text('location')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // پرونده‌های بایگانی
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archive_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 50)->unique();
            $table->text('description')->nullable();
            $table->integer('retention_period')->nullable();
            $table->enum('retention_unit', ['days', 'months', 'years'])->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // رابط نامه و پرونده
        Schema::create('letter_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('file_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['letter_id', 'file_id']);
        });

        // دسترسی‌های بایگانی
        Schema::create('archive_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archive_id')->constrained()->cascadeOnDelete();
            $table->foreignId('position_id')->constrained()->cascadeOnDelete();
            $table->enum('permission_type', ['read', 'write', 'delete', 'manage']);
            $table->timestamps();
        });

        // اطلاعیه‌ها
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('target_type', ['all', 'department', 'position', 'user'])->default('all');
            $table->json('target_ids')->nullable();
            $table->string('attachment_path', 500)->nullable();
            $table->dateTime('publish_date')->nullable();
            $table->dateTime('expiry_date')->nullable();
            $table->boolean('is_published')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // لاگ رویدادها
        Schema::create('event_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type', 100);
            $table->string('subject_type', 100)->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->text('description')->nullable();
            $table->json('properties')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['subject_type', 'subject_id']);
            $table->index('event_type');
        });

        // تنظیمات سیستم
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('group', 100);
            $table->string('key', 100);
            $table->text('value')->nullable();
            $table->enum('type', ['text', 'number', 'boolean', 'json', 'file'])->default('text');
            $table->timestamps();

            $table->unique(['organization_id', 'group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('event_logs');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('archive_permissions');
        Schema::dropIfExists('letter_files');
        Schema::dropIfExists('files');
        Schema::dropIfExists('archives');
    }
};
