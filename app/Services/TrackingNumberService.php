<?php

namespace App\Services;

class TrackingNumberService
{
    public function generate(): string
    {
        return 'TRK-' . now()->format('ymd') . '-' . strtoupper(substr(uniqid(), -5));
    }
}
