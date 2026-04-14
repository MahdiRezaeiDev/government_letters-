@extends('errors::minimal')
@section('code')
    <div class="error-container">
        <div class="error-code">404</div>
        <h1 class="error-title">صفحه مورد نظر یافت نشد</h1>
        <p class="error-message">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>
        <a href="{{ url('/') }}" class="home-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            بازگشت به صفحه اصلی
        </a>
        <div class="links">
            <a href="{{ route('login') }}">ورود</a>
            <a href="{{ url('/dashboard') }}">داشبورد</a>
        </div>
    </div>
@endsection()
