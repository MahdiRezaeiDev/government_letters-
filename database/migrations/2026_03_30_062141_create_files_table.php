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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archive_id')->constrained()->cascadeOnDelete();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('code', 100)->nullable();
            $table->text('description')->nullable();
            $table->integer('retention_period')->nullable();
            $table->enum('retention_unit', ['days', 'months', 'years'])->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
