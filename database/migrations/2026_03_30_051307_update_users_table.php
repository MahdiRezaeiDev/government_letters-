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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('organization_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('username')->unique()->after('organization_id');
            $table->string('first_name')->after('username');
            $table->string('last_name')->after('first_name');
            $table->string('national_code', 10)->unique()->nullable()->after('last_name');
            $table->string('mobile', 20)->nullable()->after('national_code');
            $table->string('employment_code', 50)->unique()->nullable()->after('mobile');
            $table->string('avatar')->nullable()->after('employment_code');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('avatar');
            $table->string('two_factor_secret')->nullable()->after('status');
            $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            $table->timestamp('last_login_at')->nullable()->after('two_factor_confirmed_at');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'organization_id', 'username', 'first_name', 'last_name',
                'national_code', 'mobile', 'employment_code', 'avatar',
                'status', 'two_factor_secret', 'two_factor_recovery_codes',
                'two_factor_confirmed_at', 'last_login_at', 'last_login_ip', 'deleted_at'
            ]);
        });
    }
};
