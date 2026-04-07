import React, { useEffect } from "react";
// ایمپورت ایمن برای جلوگیری از خطای Element type is invalid
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";

interface Props {
    label?: string;
    value?: string | null; // مقدار رشته شمسی (مثلاً 1405-01-18)
    onChange: (date: string) => void;
    error?: string;
    name?: string;
}

export default function PersianDatePicker({ 
    label, 
    value, 
    onChange, 
    error, 
    name 
}: Props) {
    
    // رفع مشکل تداخل ماژول‌ها در Vite
    const Picker: any = (DatePicker as any).default || DatePicker;

    // فرمت مورد نظر شما (با خط تیره و اعداد دو رقمی)
    const dateFormat = "YYYY-MM-DD";

    // اگر از بک‌اِند مقداری نیاید، در اولین رندر تاریخ امروز شمسی را ست می‌کنیم
    useEffect(() => {
        if (!value) {
            const today = new DateObject({ calendar: persian, locale: persian_fa });
            onChange(today.format(dateFormat));
        }
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full text-right" dir="rtl">
            <Picker
                id={name}
                calendar={persian}
                locale={persian_fa}
                value={value || ""} 
                format={dateFormat}
                onChange={(date: any) => {
                    if (date) {
                        onChange(date.format(dateFormat));
                    } else {
                        onChange("");
                    }
                }}
                // استایل‌دهی هماهنگ با Tailwind و Inputهای استاندارد
                inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-300"
                containerStyle={{ width: "100%" }}
                calendarPosition="bottom-right"
                // جلوگیری از باز شدن کیبورد در موبایل موقع انتخاب تاریخ
                readOnly={false}
            />
        </div>
    );
}