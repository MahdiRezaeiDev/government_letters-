<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->enum('letter_type', ['incoming', 'outgoing', 'internal']);
            $table->string('letter_number', 100)->unique();
            $table->string('tracking_number', 100)->unique();
            $table->enum('security_level', ['public', 'internal', 'confidential', 'secret', 'top_secret'])->default('internal');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent', 'very_urgent'])->default('normal');
            $table->foreignId('category_id')->nullable()->constrained('letter_categories');
            $table->string('subject', 500);
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->boolean('is_public')->default(false);
            
            // اصلاح: جدا کردن sender/recipient
            $table->foreignId('sender_user_id')->nullable()->constrained('users');
            $table->foreignId('sender_position_id')->nullable()->constrained('positions');
            $table->foreignId('sender_department_id')->nullable()->constrained('departments');
            $table->string('sender_name', 255)->nullable();
            $table->string('sender_position_name', 255)->nullable();
            
            $table->foreignId('recipient_user_id')->nullable()->constrained('users');
            $table->foreignId('recipient_position_id')->nullable()->constrained('positions');
            $table->foreignId('recipient_department_id')->nullable()->constrained('departments');
            $table->string('recipient_name', 255)->nullable();
            $table->string('recipient_position_name', 255)->nullable();
            
            $table->json('cc_recipients')->nullable();
            
            $table->date('date')->nullable();
            $table->date('due_date')->nullable();
            $table->date('response_deadline')->nullable();
            
            $table->foreignId('parent_letter_id')->nullable()->constrained('letters');
            $table->uuid('thread_id')->nullable();
            
            $table->foreignId('is_follow_up')->nullable()->constrained('letters');
            $table->integer('follow_up_count')->default(0);
            $table->integer('sheet_count')->default(1);
            
            $table->boolean('is_draft')->default(false);
            $table->enum('final_status', ['draft', 'pending', 'approved', 'rejected', 'archived'])->default('draft');
            
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['letter_type', 'date']);
            $table->index('security_level');
            $table->index('final_status');
            $table->index('thread_id');
            $table->index('parent_letter_id');
            $table->index(['sender_department_id', 'created_at']);
            $table->index(['recipient_department_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};