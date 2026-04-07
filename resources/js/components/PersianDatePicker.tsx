import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Label } from "@/components/ui/label"; // اگر از shadcn استفاده می‌کنید
import InputError from "@/components/input-error";

interface Props {
    label?: string;
    value: string | number | Date;
    onChange: (date: string) => void;
    error?: string;
    placeholder?: string;
}

export default function PersianDatePicker({ label, value, onChange, error, placeholder }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {label && <Label>{label}</Label>}
            
            <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={value}
                onChange={(date: DateObject) => {
                    // تبدیل به فرمت استاندارد دیتابیس (میلادی) موقع ارسال
                    onChange(date ? date.toDate().toISOString().split('T')[0] : "");
                }}
                placeholder={placeholder}
                calendarPosition="bottom-right"
                // استایل‌دهی به ورودی تقویم برای هماهنگی با بقیه اینپوت‌ها
                inputClass="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                containerStyle={{ width: "100%" }}
            />

            {error && <InputError message={error} />}
        </div>
    );
}