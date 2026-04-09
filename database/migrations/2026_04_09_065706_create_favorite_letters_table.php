<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorite_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->string('folder_name', 50)->default('important');
            $table->string('color', 7)->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'folder_name']);
            $table->index('letter_id');
            $table->unique(['user_id', 'letter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorite_letters');
    }
};