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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->unsignedBigInteger('manager_position_id')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('level')->default(0);
            $table->text('path')->nullable(); // e.g. "1/3/7"
            $table->timestamps();
            $table->softDeletes();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
