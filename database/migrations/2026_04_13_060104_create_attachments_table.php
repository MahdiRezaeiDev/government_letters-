<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->bigInteger('file_size')->unsigned();
            $table->string('mime_type', 100);
            $table->string('extension', 20);
            $table->integer('download_count')->default(0);
            $table->boolean('is_ocr_processed')->default(false);
            $table->text('ocr_text')->nullable();
            $table->timestamps();
            
            $table->index(['letter_id', 'created_at']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};