@extends('errors::minimal')

@section('title', __('Page Expired'))
@section('code')

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
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
            color: rgba(0, 0, 0, 0.1);
            line-height: 1;
            margin-bottom: 20px;
        }

        .error-title {
            font-size: 28px;
            font-weight: 700;
            color: #5c3b1f;
            margin-bottom: 16px;
        }

        .error-message {
            font-size: 16px;
            color: #7a5a3a;
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .home-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            background: #5c3b1f;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .home-button:hover {
            background: #4a2e18;
            transform: translateY(-2px);
        }
    </style>

    <body>
        <div class="error-container">
            <div class="error-code">419</div>
            <h1 class="error-title">صفحه منقضی شده</h1>
            <p class="error-message">
                صفحه مورد نظر منقضی شده است. لطفاً صفحه را refresh کرده و دوباره تلاش کنید.
            </p>
            <button onclick="location.reload()" class="home-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                باز加载 صفحه
            </button>
        </div>
    </body>
@endsection()
@section('message', __('Page Expired'))