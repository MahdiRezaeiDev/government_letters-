<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            // Fields for replying to a letter
            $table->foreignId('reply_to_letter_id')->nullable()
                ->after('parent_letter_id')
                ->constrained('letters')
                ->onDelete('set null');

            $table->timestamp('replied_at')->nullable()->after('reply_to_letter_id');

            $table->foreignId('replied_by')->nullable()
                ->after('replied_at')
                ->constrained('users')
                ->onDelete('set null');

            // Additional Index for performance
            $table->index('reply_to_letter_id');
            $table->index('replied_at');
        });
    }

    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropForeign(['reply_to_letter_id']);
            $table->dropForeign(['replied_by']);
            $table->dropColumn(['reply_to_letter_id', 'replied_at', 'replied_by']);
        });
    }
};
