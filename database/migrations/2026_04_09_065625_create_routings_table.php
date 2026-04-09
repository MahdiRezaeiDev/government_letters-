<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_position_id')->constrained('positions');
            $table->foreignId('from_user_id')->constrained('users');
            $table->foreignId('to_position_id')->constrained('positions');
            $table->foreignId('to_user_id')->nullable()->constrained('users');
            $table->enum('action_type', ['action', 'information', 'approval', 'coordination', 'sign']);
            $table->text('instruction')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'rejected', 'skipped'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->text('completed_note')->nullable();
            $table->integer('priority')->default(0);
            $table->integer('step_order')->default(0);
            $table->boolean('is_parallel')->default(false);
            $table->uuid('parallel_group_id')->nullable();
            $table->timestamps();
            
            $table->index(['letter_id', 'status']);
            $table->index(['to_user_id', 'status']);
            $table->index(['to_position_id', 'status']);
            $table->index('deadline');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routings');
    }
};