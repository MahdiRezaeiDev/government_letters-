import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

// در ابتدای فایل صفحه (مثلاً LetterController.php -> Create.tsx)

// تابعی برای گرفتن تاریخ امروز شمسی با اعداد انگلیسی و فرمت استاندارد
export function getToday () {
    return new DateObject({ calendar: persian, locale: persian_fa })
        .format("YYYY-MM-DD");
};

