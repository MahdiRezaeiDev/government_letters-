<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // migration دوم - مطابق با نام جدید
        Schema::create('case_letters', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('archive_case_id')  // ← نام فیلد هم تغییر کرد
                ->constrained('archive_cases')   // ← نام جدول جدید
                ->onDelete('cascade');
            
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->timestamp('archived_at')->useCurrent();
            $table->foreignId('archived_by')->constrained('users');
            $table->timestamps();
            
            $table->unique(['archive_case_id', 'letter_id']);
            $table->index(['letter_id', 'archived_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_letters');
    }
};