@extends('errors::layout')

@section('title', 'دسترسی غیرمجاز')

@section('content')
    <div class="error-code">403</div>
    <div class="error-icon">
        <div class="icon-circle danger">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1.5" />
                <line x1="12" y1="13" x2="12" y2="14.5" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">دسترسی غیرمجاز</h1>
    <p class="error-message">
        شما مجوز دسترسی به این صفحه را ندارید. لطفاً با مدیر سیستم تماس بگیرید.
    </p>
    @if($exception->getMessage())
        <div class="exception-details">
            <p>{{ $exception->getMessage() }}</p>
        </div>
    @endif
    <div class="action-buttons">
        <a href="{{ url('/') }}" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            بازگشت به صفحه اصلی
        </a>
        <div class="button-group">
            <a href="{{ route('login') }}" class="btn-outline">ورود مجدد</a>
            <a href="{{ url('/dashboard') }}" class="btn-outline">داشبورد</a>
        </div>
    </div>
@endsection