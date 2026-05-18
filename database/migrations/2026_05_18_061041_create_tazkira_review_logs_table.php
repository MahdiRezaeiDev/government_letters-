<?php
// database/migrations/2026_05_18_000002_create_tazkira_review_logs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tazkira_review_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tazkira_id')->constrained('tazkiras')->onDelete('cascade');
            $table->enum('action', ['approved', 'rejected', 'pending']);
            $table->text('note')->nullable();
            $table->foreignId('reviewed_by')->constrained('users');
            $table->timestamp('reviewed_at');
            $table->timestamps();

            $table->index('tazkira_id');
            $table->index('reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tazkira_review_logs');
    }
};
