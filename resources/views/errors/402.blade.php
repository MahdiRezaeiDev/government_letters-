@extends('errors::minimal')

@section('title', __('پرداخت الزامی'))

@section('content')
    <div class="error-code">402</div>
    <div class="error-icon">
        <div class="icon-circle warning">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">پرداخت الزامی</h1>
    <p class="error-message">
        برای دسترسی به این صفحه، پرداخت الزامی می‌باشد. لطفاً نسبت به تکمیل فرآیند پرداخت اقدام کنید.
    </p>
    <div class="action-buttons">
        <a href="{{ url('/billing') }}" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 12V8h-2.5M12 4v4M4 4v16h16v-4M4 12h16" />
                <circle cx="12" cy="16" r="2" />
                <path d="M8 8h8" />
            </svg>
            صفحه پرداخت
        </a>
        <div class="button-group">
            <a href="{{ url('/') }}" class="btn-outline">بازگشت به صفحه اصلی</a>
            <a href="{{ route('login') }}" class="btn-outline">ورود به سیستم</a>
        </div>
    </div>
@endsection

@section('code', '402')
@section('message', __('Payment Required'))