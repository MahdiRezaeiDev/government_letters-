<?php

use App\Models\Letter;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('letters.{letterId}', function (User $user, int $letterId) {
    return $user->id === Letter::findOrNew($letterId)->recipient_user_id;
});
