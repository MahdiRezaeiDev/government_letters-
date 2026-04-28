@extends('errors::layout')

@section('title', 'خطای سرور')

@section('content')
    <div class="error-code">500</div>
    <div class="error-icon">
        <div class="icon-circle danger">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
                <line x1="8" y1="4" x2="16" y2="20" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">خطای سرور داخلی</h1>
    <p class="error-message">
        متأسفانه خطایی در سرور رخ داده است. لطفاً چند دقیقه دیگر مجدداً تلاش کنید.
    </p>
    <div class="action-buttons">
        <a href="{{ url('/') }}" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            بازگشت به صفحه اصلی
        </a>
    </div>
@endsection