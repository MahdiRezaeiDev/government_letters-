<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('archive_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archive_id')->constrained()->onDelete('cascade');
            $table->foreignId('position_id')->constrained()->onDelete('cascade');
            $table->enum('permission_type', ['read', 'write', 'delete', 'manage']);
            $table->timestamps();
            
            // ✅ نام کوتاه‌تر برای unique index
            $table->unique(['archive_id', 'position_id', 'permission_type'], 'arch_perm_unique');
            $table->index('position_id', 'arch_perm_pos_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archive_permissions');
    }
};