<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">

    <title>@yield('title', 'خطا | NSIA')</title>
    @viteReactRefresh
    @vite(['resources/css/app.css'])
    <!-- Styles -->
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', system-ui, -apple-system, 'Roboto', sans-serif;
            background: linear-gradient(135deg, #1a2a3a 0%, #0f1a24 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }

        /* Decorative Pattern */
        body::before {
            content: '';
            position: absolute;
            inset: 0;
            opacity: 0.05;
            pointer-events: none;
        }

        .decorative-circle {
            position: absolute;
            background: #20c997;
            border-radius: 50%;
            opacity: 0.1;
            pointer-events: none;
        }

        .circle-1 {
            width: 400px;
            height: 400px;
            top: -200px;
            left: -200px;
        }

        .circle-2 {
            width: 300px;
            height: 300px;
            bottom: -150px;
            right: -150px;
        }

        .circle-3 {
            width: 200px;
            height: 200px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .circle-4 {
            width: 150px;
            height: 150px;
            top: 20%;
            right: 10%;
        }

        .circle-5 {
            width: 120px;
            height: 120px;
            bottom: 15%;
            left: 10%;
        }

        /* Main Container */
        .error-container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 500px;
        }

        /* Logo Section */
        .logo-section {
            text-align: center;
            margin-bottom: 2rem;
        }

        .logo-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 110px;
            height: 110px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3);
            margin-bottom: 1.5rem;
            padding: 1rem;
        }

        .logo-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .org-name {
            font-size: 1.25rem;
            font-weight: bold;
            color: white;
            margin-bottom: 0.25rem;
        }

        .org-sub {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.875rem;
        }

        /* Error Card */
        .error-card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 2rem;
            text-align: center;
        }

        /* Error Code */
        .error-code {
            font-size: 6rem;
            font-weight: 800;
            background: linear-gradient(135deg, #20c997 0%, #0d9488 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            line-height: 1;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }

        /* Error Icon */
        .error-icon {
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
        }

        .icon-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .icon-circle.warning {
            background: #fef3c7;
        }

        .icon-circle.warning svg {
            color: #d97706;
        }

        .icon-circle.danger {
            background: #fee2e2;
        }

        .icon-circle.danger svg {
            color: #dc2626;
        }

        .icon-circle.info {
            background: #dbeafe;
        }

        .icon-circle.info svg {
            color: #2563eb;
        }

        /* Error Title */
        .error-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.75rem;
        }

        /* Error Message */
        .error-message {
            color: #6b7280;
            font-size: 0.875rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        /* Exception Details */
        .exception-details {
            background: #f9fafb;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            border-right: 3px solid #20c997;
            text-align: right;
        }

        .exception-details p {
            color: #4b5563;
            font-size: 0.813rem;
            font-family: monospace;
            word-break: break-word;
        }

        /* Action Buttons */
        .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .btn-primary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.75rem 1.5rem;
            background: #20c997;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
        }

        .btn-primary:hover {
            background: #0d9488;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(32, 201, 151, 0.3);
        }

        .btn-outline {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            flex: 1;
            padding: 0.625rem 1rem;
            background: transparent;
            color: #4b5563;
            text-decoration: none;
            border-radius: 10px;
            font-size: 0.813rem;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 1px solid #e5e7eb;
        }

        .btn-outline:hover {
            background: #f9fafb;
            border-color: #20c997;
            color: #20c997;
        }

        .button-group {
            display: flex;
            gap: 0.75rem;
            margin-top: 0.5rem;
        }

        /* Footer */
        .footer {
            text-align: center;
            margin-top: 1.5rem;
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.75rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
            .error-card {
                padding: 1.5rem;
            }

            .error-code {
                font-size: 4rem;
            }

            .button-group {
                flex-direction: column;
            }

            .logo-wrapper {
                width: 80px;
                height: 80px;
            }
        }
    </style>

    @stack('styles')
</head>

<body>
    <!-- Decorative Elements -->
    {{-- <div class="decorative-circle circle-1"></div> --}}
    <div class="decorative-circle circle-2"></div>
    <div class="decorative-circle circle-3"></div>
    <div class="decorative-circle circle-4"></div>
    <div class="decorative-circle circle-5"></div>

    <div class="error-container">
        <!-- Logo Section -->
        <div class="logo-section">
            <div class="logo-wrapper">
                <img src="https://nsia.gov.af/assets/logo/amended-logo%20final%20final-01.svg" alt="NSIA Logo"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%2320c997\'/%3E%3Ctext x=\'50\' y=\'67\' font-size=\'50\' text-anchor=\'middle\' fill=\'white\'%3ENSIA%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="org-name">اداره ملی احصائیه و معلومات</div>
            <div class="org-sub">د افغانستان اسلامی امارت</div>
        </div>

        <!-- Error Card -->
        <div class="error-card">
            @yield('content')
        </div>

        <!-- Footer -->
        <div class="footer">
            © {{ date('Y') }} NSIA - تمام حقوق محفوظ است
        </div>
    </div>
</body>

</html>