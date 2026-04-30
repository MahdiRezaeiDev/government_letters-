<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('letters', function (Blueprint $table) {
            // فیلدهای پاسخ به نامه
            $table->foreignId('reply_to_letter_id')->nullable()->after('parent_letter_id')
                ->constrained('letters')->onDelete('set null');
            $table->timestamp('replied_at')->nullable()->after('reply_to_letter_id');
            $table->foreignId('replied_by')->nullable()->after('replied_at')
                ->constrained('users')->onDelete('set null');

            // فیلدهای تعقیب نامه
            $table->date('next_follow_up_date')->nullable()->after('follow_up_count');
            $table->timestamp('last_follow_up_at')->nullable()->after('next_follow_up_date');
            $table->enum('follow_up_status', ['pending', 'in_progress', 'completed', 'overdue', 'cancelled'])
                ->default('pending')->after('last_follow_up_at');
            $table->text('follow_up_notes')->nullable()->after('follow_up_status');

            // ایندکس‌ها
            $table->index('reply_to_letter_id');
            $table->index('replied_at');
            $table->index('follow_up_status');
            $table->index('next_follow_up_date');
            $table->index(['is_follow_up', 'follow_up_status']);
        });
    }

    public function down()
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropForeign(['reply_to_letter_id']);
            $table->dropForeign(['replied_by']);
            $table->dropColumn([
                'reply_to_letter_id',
                'replied_at',
                'replied_by',
                'next_follow_up_date',
                'last_follow_up_at',
                'follow_up_status',
                'follow_up_notes',
            ]);
        });
    }
};
