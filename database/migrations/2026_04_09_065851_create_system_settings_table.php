<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('group', 100);
            $table->string('key', 100);
            $table->text('value')->nullable();
            $table->enum('type', ['text', 'number', 'boolean', 'json', 'file'])->default('text');
            $table->timestamps();
            
            $table->unique(['organization_id', 'group', 'key']);
            $table->index(['group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};