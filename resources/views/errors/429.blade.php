@extends('errors::minimal')

@section('title', __('Too Many Requests'))
@section('code')
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .error-container {
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .error-code {
            font-size: 120px;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.2);
            line-height: 1;
            margin-bottom: 20px;
        }

        .error-title {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 16px;
        }

        .error-message {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .home-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            background: white;
            color: #f12711;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .home-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .timer {
            margin-top: 30px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }
    </style>

    <body>
        <div class="error-container">
            <div class="error-code">429</div>
            <h1 class="error-title">درخواست زیاد</h1>
            <p class="error-message">
                تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه دیگر تلاش کنید.
            </p>
            <a href="{{ url('/') }}" class="home-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                بازگشت به صفحه اصلی
                </button>
                <div class="timer">
                    لطفاً چند دقیقه دیگر تلاش کنید
                </div>
        </div>
    </body>
@endsection()
@section('message', __('Too Many Requests'))