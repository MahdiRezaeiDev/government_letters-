<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->foreignId('routing_id')->nullable()->constrained('routings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('reminder_type', ['deadline', 'follow_up', 'custom']);
            $table->dateTime('reminder_date');
            $table->text('message')->nullable();
            $table->boolean('is_sent')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->enum('status', ['pending', 'sent', 'cancelled', 'completed'])->default('pending');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            
            $table->index(['user_id', 'reminder_date', 'is_sent']);
            $table->index('letter_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};