<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('target_type', ['all', 'department', 'position', 'user']);
            $table->json('target_ids')->nullable();
            $table->string('attachment_path', 500)->nullable();
            $table->dateTime('publish_date');
            $table->dateTime('expiry_date')->nullable();
            $table->boolean('is_published')->default(false);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            
            $table->index(['publish_date', 'expiry_date']);
            $table->index('is_published');
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};