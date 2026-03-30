<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custom_form_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_form_id')->constrained()->cascadeOnDelete();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->json('form_data')->nullable();
            $table->foreignId('submitted_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_form_data');
    }
};
