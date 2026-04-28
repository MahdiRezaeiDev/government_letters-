@extends('errors::minimal')

@section('title', __('عدم احراز هویت'))

@section('content')
    <div class="error-code">401</div>
    <div class="error-icon">
        <div class="icon-circle danger">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                <line x1="12" y1="11" x2="12" y2="15" />
                <path d="M17 3.5L19 2" />
                <path d="M7 3.5L5 2" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">عدم احراز هویت</h1>
    <p class="error-message">
        برای دسترسی به این صفحه، نیاز به احراز هویت می‌باشد. لطفاً وارد حساب کاربری خود شوید.
    </p>
    <div class="action-buttons">
        <a href="{{ route('login') }}" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            ورود به سیستم
        </a>
        <div class="button-group">
            <a href="{{ url('/') }}" class="btn-outline">بازگشت به صفحه اصلی</a>
            <a href="{{ route('register') ?? url('/register') }}" class="btn-outline">ثبت نام</a>
        </div>
    </div>
@endsection

@section('code', '401')
@section('message', __('Unauthorized'))