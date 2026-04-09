<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // migration اول - اصلاح شده
        Schema::create('archive_cases', function (Blueprint $table) {  // ✅ نام استاندارد
            $table->id();
            $table->foreignId('archive_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('case_number', 50)->unique();
            $table->text('description')->nullable();
            $table->integer('retention_period')->nullable();
            $table->enum('retention_unit', ['days', 'months', 'years'])->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['archive_id', 'is_active']);
            $table->index('case_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archive_cases');
    }
};