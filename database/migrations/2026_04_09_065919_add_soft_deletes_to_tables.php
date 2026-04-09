<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routings', function (Blueprint $table) {
            $table->softDeletes();
        });
        
        Schema::table('actions', function (Blueprint $table) {
            $table->softDeletes();
        });
        
        Schema::table('announcements', function (Blueprint $table) {
            $table->softDeletes();
        });
        
        Schema::table('archives', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('routings', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        
        Schema::table('actions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        
        Schema::table('archives', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};