<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routings', function (Blueprint $table) {
            $table->boolean('is_reception')->default(false)->after('step_order');
        });
    }

    public function down(): void
    {
        Schema::table('routings', function (Blueprint $table) {
            $table->dropColumn('is_reception');
        });
    }
};
