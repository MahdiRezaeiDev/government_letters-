@extends('errors::minimal')

@section('title', __('页面 منقضی شده'))

@section('content')
    <div class="error-code">419</div>
    <div class="error-icon">
        <div class="icon-circle warning">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
                <line x1="12" y1="12" x2="12" y2="12.01" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">صفحه منقضی شده</h1>
    <p class="error-message">
        نشست شما منقضی شده است. لطفاً صفحه را بازخوانی کرده و دوباره تلاش کنید.
    </p>
    <p class="error-message" style="font-size: 0.813rem; color: #9ca3af; margin-top: -0.75rem;">
        معمولاً این مشکل به دلیل عدم فعالیت طولانی مدت یا باز بودن صفحه برای مدت طولانی رخ می‌دهد.
    </p>
    <div class="action-buttons">
        <button onclick="location.reload()" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 5v3M12 16v3" />
                <path d="M19 8l-2 2M7 14l-2 2" />
                <path d="M5 8l2 2M19 14l-2 2" />
            </svg>
            بازخوانی صفحه
        </button>
        <div class="button-group">
            <a href="{{ url('/') }}" class="btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                صفحه اصلی
            </a>
            <a href="{{ route('login') }}" class="btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                ورود مجدد
            </a>
        </div>
    </div>
@endsection

@section('code', '419')
@section('message', __('Page Expired'))