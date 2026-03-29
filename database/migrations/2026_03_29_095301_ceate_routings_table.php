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
        Schema::create('routings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_position_id')->nullable()->constrained('positions')->nullOnDelete();
            $table->foreignId('from_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('to_position_id')->nullable()->constrained('positions')->nullOnDelete();
            $table->foreignId('to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('action_type', ['action', 'information', 'approval', 'coordination', 'sign']);
            $table->text('instruction')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->boolean('reminder_sent')->default(false);
            $table->timestamp('reminder_sent_at')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'rejected', 'skipped'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->text('completed_note')->nullable();
            $table->integer('priority')->default(0);
            $table->integer('step_order')->default(0);
            $table->boolean('is_parallel')->default(false);
            $table->string('parallel_group_id', 36)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
