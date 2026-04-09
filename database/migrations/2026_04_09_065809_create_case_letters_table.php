<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained()->onDelete('cascade');
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->timestamp('archived_at')->useCurrent();
            $table->foreignId('archived_by')->constrained('users');
            $table->timestamps();
            
            $table->unique(['case_id', 'letter_id']);
            $table->index(['letter_id', 'archived_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_letters');
    }
};