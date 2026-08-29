<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Apply the authenticated user's preferred interface language.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->user()?->locale ?? config('app.locale');

        if (in_array($locale, ['fa', 'ps', 'en'], true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
