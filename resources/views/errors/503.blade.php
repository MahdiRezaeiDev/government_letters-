@extends('errors::minimal')

@section('title', __('Service Unavailable'))
@section('code')
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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

        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .progress {
            width: 60%;
            height: 100%;
            background: white;
            border-radius: 2px;
            animation: progress 2s ease-in-out infinite;
        }

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
    </style>

    <body>
        <div class="error-container">
            <div class="error-code">503</div>
            <h1 class="error-title">در حال بروزرسانی</h1>
            <p class="error-message">
                سیستم در حال بروزرسانی است. لطفاً چند دقیقه دیگر تلاش کنید.
            </p>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
            <a href="{{ url('/') }}" class="home-button">
                بازگشت به صفحه اصلی
            </a>
        </div>
    </body>
@endsection()
@section('message', __('Service Unavailable'))