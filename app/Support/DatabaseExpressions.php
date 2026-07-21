<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

class DatabaseExpressions
{
    /**
     * SQL expression that formats a datetime column as YYYY-MM.
     */
    public static function yearMonth(string $column = 'created_at'): string
    {
        return match (DB::getDriverName()) {
            'sqlite' => "strftime('%Y-%m', {$column})",
            'pgsql' => "to_char({$column}, 'YYYY-MM')",
            default => "DATE_FORMAT({$column}, \"%Y-%m\")",
        };
    }
}
