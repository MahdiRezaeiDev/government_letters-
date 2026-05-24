<!DOCTYPE html>
<html dir="rtl" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- تشخیص dark mode --}}
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';
            if (appearance === 'system') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    {{-- فونت سیستم از دیتابیس -- قبل از هر چیز دیگری --}}
    <style>
        :root {
            --font-family: '{{ auth()->check() ? auth()->user()->preferred_font : 'Vazirmatn' }}', Tahoma, sans-serif;
        }
    </style>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

    <x-inertia::head>
        <title>{{ config('app.name', 'سیستم مدیریت مکتوب') }}</title>
    </x-inertia::head>
</head>

<body class="antialiased">
    <x-inertia::app />
</body>

</html>