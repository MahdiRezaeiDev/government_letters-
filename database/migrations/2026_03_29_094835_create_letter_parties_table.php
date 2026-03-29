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
        Schema::create('letter_parties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->enum('party_type', ['person', 'company', 'organization']);
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letter_parties');
    }
};
