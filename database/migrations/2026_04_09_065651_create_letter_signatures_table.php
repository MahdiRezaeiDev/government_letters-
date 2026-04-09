<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_signatures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('signature_type', ['digital', 'electronic', 'handwritten_scan']);
            $table->text('signature_data')->nullable();
            $table->string('certificate_id', 255)->nullable();
            $table->timestamp('signed_at')->useCurrent();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->boolean('verification_result')->nullable();
            $table->timestamps();
            
            $table->index('letter_id');
            $table->index(['user_id', 'signed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_signatures');
    }
};