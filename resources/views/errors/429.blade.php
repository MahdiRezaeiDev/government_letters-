@extends('errors::minimal')

@section('title', __('درخواست زیاد'))

@section('content')
    <div class="error-code">429</div>
    <div class="error-icon">
        <div class="icon-circle warning">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
                <line x1="8" y1="4" x2="16" y2="20" />
                <path d="M4 4 L20 20" />
                <path d="M4 12 H20" />
                <path d="M12 4 V20" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">درخواست زیاد</h1>
    <p class="error-message">
        تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید و سپس دوباره تلاش کنید.
    </p>
    <div class="exception-details">
        <p>به دلیل ارسال درخواست‌های مکرر، دسترسی شما به طور موقت محدود شده است.</p>
    </div>
    <div class="action-buttons">
        <button onclick="location.reload()" class="btn-primary" id="retryButton" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <span id="buttonText">تلاش مجدد</span>
            <span id="countdown" style="margin-right: 8px;"></span>
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
                ورود
            </a>
        </div>
    </div>

    <script>
        // Optional: Countdown timer for 60 seconds
        let seconds = 60;
        const retryButton = document.getElementById('retryButton');
        const buttonText = document.getElementById('buttonText');
        const countdownSpan = document.getElementById('countdown');

        if (countdownSpan) {
            const timer = setInterval(function () {
                seconds--;
                if (seconds >= 0) {
                    countdownSpan.textContent = `(${seconds} ثانیه)`;
                    if (seconds === 0) {
                        clearInterval(timer);
                        retryButton.disabled = false;
                        buttonText.textContent = 'تلاش مجدد';
                        countdownSpan.textContent = '';
                    }
                }
            }, 1000);
        }
    </script>
@endsection

@section('code', '429')
@section('message', __('Too Many Requests'))