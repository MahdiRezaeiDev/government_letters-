<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('letter_delegations', function (Blueprint $table) {
            $table->id();
            
            // مکتوب مورد نظر
            $table->foreignId('letter_id')
                ->constrained('letters')
                ->onDelete('cascade')
                ->comment('مکتوبی که ارجاع می‌شود');
            
            // شخص ارجاع دهنده (گیرنده اصلی)
            $table->foreignId('delegated_by_user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('شخصی که ارجاع می‌دهد (گیرنده اصلی)');
            
            // شخص ارجاع گیرنده (همکار)
            $table->foreignId('delegated_to_user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('شخصی که به او ارجاع می‌شود');
            
            // دستورالعمل
            $table->text('delegated_note')
                ->nullable()
                ->comment('دستورالعمل برای شخص ارجاع شده');
            
            // وضعیت ارجاع
            $table->enum('status', [
                'pending',      // در انتظار - هنوز واکنشی نشان نداده
                'accepted',     // پذیرفته شده - قبول کرده که پاسخ دهد
                'replied',      // پاسخ داده شده - پاسخ خود را ارسال کرده
                'rejected',     // رد شده - نمی‌خواهد پاسخ دهد
                'expired'       // منقضی شده - مهلت تمام شده
            ])->default('pending')->comment('وضعیت ارجاع');
            
            // زمان‌ها
            $table->timestamp('delegated_at')
                ->nullable()
                ->comment('زمان ارجاع');
            
            $table->timestamp('accepted_at')
                ->nullable()
                ->comment('زمان پذیرش توسط شخص ارجاع شده');
            
            $table->timestamp('replied_at')
                ->nullable()
                ->comment('زمان پاسخ دادن');
            
            // ثبت کننده
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('ثبت‌کننده ارجاع');
            
            $table->timestamps();
            
            // ایندکس‌ها برای جستجوی بهتر
            $table->index('delegated_by_user_id');
            $table->index('delegated_to_user_id');
            $table->index('letter_id');
            $table->index('status');
            $table->index('delegated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letter_delegations');
    }
};