<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ایجاد جداول دسته‌بندی نامه‌ها و طرف‌های مکاتبات
     */
    public function up(): void
    {
        // دسته‌بندی نامه‌ها
        Schema::create('letter_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('letter_categories')->nullOnDelete();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#3B82F6');
            $table->integer('sort_order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        // طرف‌های مکاتبات (اشخاص یا سازمان‌های خارجی)
        Schema::create('letter_parties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->enum('party_type', ['person', 'company', 'organization'])->default('person');
            $table->string('name');
            $table->string('legal_name')->nullable();
            $table->string('national_id', 20)->nullable();
            $table->string('economic_code', 20)->nullable();
            $table->string('registration_number', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('fax', 50)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('contact_person')->nullable();
            $table->text('description')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_parties');
        Schema::dropIfExists('letter_categories');
    }
};
