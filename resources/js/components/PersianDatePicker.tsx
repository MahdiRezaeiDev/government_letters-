import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";

interface Props {
    label?: string;
    value?: string | null;
    onChange: (date: string) => void;
    error?: string;
}

export default function PersianDatePicker({ label, value, onChange, error }: Props) {
    
    // رفع مشکل "Element type is invalid"
    const Picker: any = (DatePicker as any).default || DatePicker;

    // تنظیم مقدار اولیه:
    // اگر value از بک‌اِند نیامده بود، تاریخ امروز را به صورت شمسی تولید کن
    const getInitialValue = () => {
        if (value) return value;
        
        return new DateObject({ calendar: persian, locale: persian_fa }).format("YYYY/MM/DD");
    };

    return (
        <div className="flex flex-col gap-2 w-full text-right" dir="rtl">
            {label && <Label className="text-right mb-1">{label}</Label>}
            
            <Picker
                calendar={persian}
                locale={persian_fa}
                value={getInitialValue()} 
                onChange={(date: any) => {
                    if (date) {
                        // ارسال رشته شمسی به Inertia (مطابق با Cast بک‌اِند)
                        onChange(date.format("YYYY/MM/DD"));
                    } else {
                        onChange("");
                    }
                }}
                inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-ring outline-none border-gray-300 focus:border-blue-500"
                containerStyle={{ width: "100%" }}
                calendarPosition="bottom-right"
            />

            {error && <InputError message={error} />}
        </div>
    );
}