<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ایجاد جداول پیوست‌ها، کلمات کلیدی، ارجاعات
     */
    public function up(): void
    {
        // پیوست‌های نامه
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('file_name');
            $table->string('file_path', 500);
            $table->bigInteger('file_size')->default(0);
            $table->string('mime_type', 100)->nullable();
            $table->string('extension', 20)->nullable();
            $table->boolean('is_ocr_processed')->default(false);
            $table->text('ocr_text')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamps();
        });

        // کلمات کلیدی
        Schema::create('keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->timestamps();
            $table->unique(['organization_id', 'name']);
        });

        // رابط نامه و کلمات کلیدی
        Schema::create('letter_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('keyword_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['letter_id', 'keyword_id']);
        });

        // ارجاعات و گردش کار
        Schema::create('routings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_position_id')->nullable()->constrained('positions')->nullOnDelete();
            $table->foreignId('from_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('to_position_id')->nullable()->constrained('positions')->nullOnDelete();
            $table->foreignId('to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('action_type', ['action', 'information', 'approval', 'coordination', 'sign'])->default('action');
            $table->text('instruction')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->boolean('reminder_sent')->default(false);
            $table->timestamp('reminder_sent_at')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'rejected', 'skipped'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->text('completed_note')->nullable();
            $table->integer('priority')->default(0);
            $table->integer('step_order')->default(1);
            $table->boolean('is_parallel')->default(false);
            $table->string('parallel_group_id', 36)->nullable();
            $table->timestamps();
        });

        // اقدامات روی ارجاعات
        Schema::create('actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('action_type', ['view', 'download', 'complete', 'reject', 'forward', 'comment']);
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actions');
        Schema::dropIfExists('routings');
        Schema::dropIfExists('letter_keywords');
        Schema::dropIfExists('keywords');
        Schema::dropIfExists('attachments');
    }
};
