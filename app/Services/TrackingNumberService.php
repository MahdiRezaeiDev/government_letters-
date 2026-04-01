<?php
namespace App\Services;

class TrackingNumberService
{
    public function generate(): string
    {
        // TRK-timestamp-random
        return 'TRK-' . now()->format('ymd') . '-' . strtoupper(substr(uniqid(), -5));
    }
}