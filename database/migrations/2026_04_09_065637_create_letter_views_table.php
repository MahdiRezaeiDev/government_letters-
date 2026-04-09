<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('viewed_at')->useCurrent();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->integer('duration')->nullable()->comment('مدت زمان مشاهده به ثانیه');
            
            $table->index(['letter_id', 'user_id']);
            $table->index('viewed_at');
            
            $table->unique(['letter_id', 'user_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_views');
    }
};