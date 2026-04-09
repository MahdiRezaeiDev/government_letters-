<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('position_id')->constrained()->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('deputy_user_id')->nullable()->constrained('users');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            
            $table->unique(['user_id', 'position_id', 'start_date']);
            $table->index(['position_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_positions');
    }
};