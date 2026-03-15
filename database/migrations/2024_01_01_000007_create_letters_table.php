<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ایجاد جدول اصلی نامه‌ها
     */
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();

            // نوع و اطلاعات پایه نامه
            $table->enum('letter_type', ['incoming', 'outgoing', 'internal']);
            $table->string('letter_number', 100)->unique()->nullable();
            $table->string('tracking_number', 100)->unique()->nullable();
            $table->enum('security_level', ['public', 'internal', 'confidential', 'secret', 'top_secret'])->default('internal');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent', 'very_urgent'])->default('normal');

            $table->foreignId('category_id')->nullable()->constrained('letter_categories')->nullOnDelete();
            $table->string('subject', 500);
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->json('draft_content')->nullable(); // محتوای JSON ویرایشگر متن

            // فرستنده
            $table->enum('sender_type', ['internal', 'external'])->default('internal');
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->string('sender_name')->nullable();
            $table->string('sender_position')->nullable();

            // گیرنده
            $table->enum('recipient_type', ['internal', 'external'])->default('internal');
            $table->unsignedBigInteger('recipient_id')->nullable();
            $table->string('recipient_name')->nullable();
            $table->string('recipient_position')->nullable();

            // رونوشت (به صورت JSON)
            $table->json('cc_recipients')->nullable();

            // تاریخ‌ها
            $table->date('date');
            $table->date('due_date')->nullable();
            $table->date('response_deadline')->nullable();

            // روابط بین نامه‌ها
            $table->foreignId('is_response_to')->nullable()->constrained('letters')->nullOnDelete();
            $table->foreignId('is_follow_up')->nullable()->constrained('letters')->nullOnDelete();
            $table->integer('follow_up_count')->default(0);

            // اطلاعات اضافی
            $table->integer('sheet_count')->default(1);

            // پیش‌نویس
            $table->boolean('is_draft')->default(false);
            $table->foreignId('draft_of')->nullable()->constrained('letters')->nullOnDelete();
            $table->integer('draft_step')->default(1);

            $table->enum('final_status', ['draft', 'pending', 'approved', 'rejected', 'archived'])->default('draft');

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            // ایندکس‌های مهم برای بهبود کارایی
            $table->index(['letter_type', 'date']);
            $table->index('security_level');
            $table->index('final_status');
            $table->index('organization_id');
        });

        // گیرندگان و فرستندگان نامه
        Schema::create('letter_recipients_senders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('party_id')->constrained('letter_parties')->cascadeOnDelete();
            $table->enum('type', ['sender', 'recipient', 'cc']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_recipients_senders');
        Schema::dropIfExists('letters');
    }
};
