@extends('errors::minimal')

@section('title', __('سرویس در دسترس نیست'))

@section('content')
    <div class="error-code">503</div>
    <div class="error-icon">
        <div class="icon-circle info">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
                <line x1="12" y1="12" x2="12" y2="12.01" />
                <path d="M4 4 L20 20" />
                <path d="M4 20 L20 4" />
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        </div>
    </div>
    <h1 class="error-title">سرویس در دسترس نیست</h1>
    <p class="error-message">
        سیستم در حال بروزرسانی یا نگهداری است. لطفاً چند دقیقه دیگر تلاش کنید.
    </p>
    <div class="exception-details">
        <p>ما در حال بهبود سرویس‌های خود هستیم. با تشکر از صبر و شکیبایی شما.</p>
    </div>
    <div class="progress-bar"
        style="width: 100%; height: 4px; background: rgba(32, 201, 151, 0.2); border-radius: 2px; overflow: hidden; margin-bottom: 1.5rem;">
        <div class="progress"
            style="width: 60%; height: 100%; background: #20c997; border-radius: 2px; animation: progress 2s ease-in-out infinite;">
        </div>
    </div>
    <div class="action-buttons">
        <button onclick="setTimeout(() => location.reload(), 30000)" class="btn-primary" id="retryButton">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <path d="M23 12a11 11 0 1 0-22 0" />
                <path d="M12 5v3M12 16v3" />
            </svg>
            <span id="buttonText">تلاش مجدد خودکار در ۳۰ ثانیه</span>
        </button>
        <div class="button-group">
            <a href="{{ url('/') }}" class="btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                صفحه اصلی
            </a>
            <button onclick="location.reload()" class="btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
                </svg>
                تلاش دستی
            </button>
        </div>
    </div>

    <style>
        @keyframes progress {
            0% {
                width: 0%;
            }

            50% {
                width: 70%;
            }

            100% {
                width: 100%;
            }
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(32, 201, 151, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin: 1.5rem 0;
        }

        .progress {
            height: 100%;
            background: #20c997;
            border-radius: 2px;
            animation: progress 2s ease-in-out infinite;
        }
    </style>

    <script>
        // Auto-retry countdown
        let seconds = 30;
        const retryButton = document.getElementById('retryButton');
        const buttonText = document.getElementById('buttonText');

        const timer = setInterval(function () {
            seconds--;
            if (seconds >= 0) {
                buttonText.textContent = `تلاش مجدد خودکار در ${seconds} ثانیه`;
                if (seconds === 0) {
                    clearInterval(timer);
                    location.reload();
                }
            }
        }, 1000);
    </script>
@endsection

@section('code', '503')
@section('message', __('Service Unavailable'))