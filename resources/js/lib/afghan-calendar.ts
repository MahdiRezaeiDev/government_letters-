import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';

export const AFGHAN_MONTHS = [
    'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله',
    'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت',
] as const;

/**
 * تبدیل کلید ماه میلادی (مثلاً 2026-07) به نام ماه افغانی + سال شمسی
 */
export function formatGregorianMonthKey(monthKey: string, shortYear = false): string {
    if (!monthKey?.includes('-')) {
        return monthKey;
    }

    const [year, month] = monthKey.split('-').map(Number);
    const gregorianDate = new Date(year, month - 1, 1);
    const jalali = new DateObject(gregorianDate).convert(persian);

    const monthName = AFGHAN_MONTHS[jalali.month.number - 1] ?? jalali.month.name;
    const jalaliYear = shortYear ? String(jalali.year).slice(-2) : jalali.year;

    return `${monthName} ${jalaliYear}`;
}

/**
 * فرمت تاریخ میلادی به تاریخ شمسی افغانی
 */
export function formatAfghanDate(
    date: string | Date,
    options: { includeWeekday?: boolean; includeYear?: boolean } = {},
): string {
    const { includeWeekday = false, includeYear = true } = options;
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return '—';
    }

    const jalali = new DateObject(d).convert(persian);
    const monthName = AFGHAN_MONTHS[jalali.month.number - 1] ?? jalali.month.name;
    const weekdays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    const weekday = weekdays[d.getDay()];

    const parts: string[] = [];
    if (includeWeekday) parts.push(weekday);
    parts.push(`${jalali.day} ${monthName}`);
    if (includeYear) parts.push(String(jalali.year));

    return parts.join(' ');
}

/**
 * تاریخ امروز به شمسی افغانی
 */
export function todayAfghanLabel(includeWeekday = true): string {
    return formatAfghanDate(new Date(), { includeWeekday, includeYear: true });
}
