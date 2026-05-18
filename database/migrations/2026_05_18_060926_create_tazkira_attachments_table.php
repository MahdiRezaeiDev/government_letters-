<?php
// database/migrations/2026_05_18_000001_create_tazkira_attachments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tazkira_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tazkira_id')->constrained('tazkiras')->onDelete('cascade');
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('file_type', 50)->nullable(); // image, pdf, document
            $table->string('mime_type', 100)->nullable();
            $table->integer('file_size')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();

            $table->index('tazkira_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tazkira_attachments');
    }
};
