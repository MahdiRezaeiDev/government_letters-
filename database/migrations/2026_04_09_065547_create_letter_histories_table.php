<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->enum('action_type', ['created', 'updated', 'status_changed', 'routed', 'viewed', 'archived', 'delegated']);
            $table->string('field_name', 100)->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->json('changes')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index(['letter_id', 'created_at']);
            $table->index('user_id');
            $table->index('action_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_histories');
    }
};