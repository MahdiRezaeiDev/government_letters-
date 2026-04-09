<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('draft_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->nullable()->constrained('letters')->onDelete('set null');
            $table->string('title', 500);
            $table->json('content');
            $table->text('summary')->nullable();
            $table->integer('version')->default(1);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('locked_by')->nullable()->constrained('users');
            $table->timestamp('locked_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['letter_id', 'version']);
            $table->index(['locked_by', 'locked_at']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('draft_letters');
    }
};