<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="utf-8">
    <title>گزارش مکاتیب</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #111; direction: rtl; }
        h1 { font-size: 16px; margin: 0 0 8px; }
        .meta { margin-bottom: 16px; color: #444; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: right; }
        th { background: #f3f4f6; font-weight: bold; }
        .stats { margin-bottom: 14px; }
        .stats span { display: inline-block; margin-left: 12px; }
    </style>
</head>
<body>
    <h1>گزارش مکاتیب اداری</h1>
    <div class="meta">تاریخ تهیه: {{ now()->format('Y/m/d H:i') }}</div>

    @if (!empty($overview))
        <div class="stats">
            <span>مجموع: {{ $overview['total'] ?? 0 }}</span>
            <span>وارده: {{ $overview['incoming'] ?? 0 }}</span>
            <span>صادره: {{ $overview['outgoing'] ?? 0 }}</span>
            <span>داخلی: {{ $overview['internal'] ?? 0 }}</span>
            <span>در انتظار: {{ $overview['pending'] ?? 0 }}</span>
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>شماره مکتوب</th>
                <th>موضوع</th>
                <th>نوع</th>
                <th>اولویت</th>
                <th>وضعیت</th>
                <th>فرستنده</th>
                <th>گیرنده</th>
                <th>تاریخ</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $letter)
                <tr>
                    <td>{{ $letter->letter_number }}</td>
                    <td>{{ $letter->subject }}</td>
                    <td>{{ $typeLabels[$letter->letter_type] ?? $letter->letter_type }}</td>
                    <td>{{ $priorityLabels[$letter->priority] ?? $letter->priority }}</td>
                    <td>{{ $statusLabels[$letter->final_status] ?? $letter->final_status }}</td>
                    <td>{{ $letter->sender_name }}</td>
                    <td>{{ $letter->recipient_name }}</td>
                    <td>{{ $letter->created_at?->format('Y/m/d H:i') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8">موردی یافت نشد.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
