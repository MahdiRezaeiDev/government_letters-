import React from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import * as DatePickerModule from "react-multi-date-picker";

const DatePicker = (
    (DatePickerModule as any).default?.default ||
    (DatePickerModule as any).default ||
    DatePickerModule
) as React.ElementType;

interface Props {
    value: string;
    onChange: (date: string) => void;
    label?: string;
    error?: string;
    placeholder?: string;
}

const afghan_dari = {
    ...persian_fa,
    months: [
        ["حمل", "حمل"],
        ["ثور", "ثور"],
        ["جوزا", "جوزا"],
        ["سرطان", "سرطان"],
        ["اسد", "اسد"],
        ["سنبله", "سنبله"],
        ["میزان", "میزان"],
        ["عقرب", "عقرب"],
        ["قوس", "قوس"],
        ["جدی", "جدی"],
        ["دلو", "دلو"],
        ["حوت", "حوت"],
    ],
};

const PersianDatePicker: React.FC<Props> = ({
    value,
    onChange,
    label,
    error,
    placeholder = "انتخاب تاریخ..."
}) => {
    return (
        <div className="w-full flex flex-col" style={{ direction: 'rtl' }}>
            {label && (
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className="relative">
                <DatePicker
                    value={value}
                    onChange={(date: any) => {
                        onChange(date ? date.format("YYYY-MM-DD") : "");
                    }}
                    calendar={persian}
                    locale={afghan_dari}  // ✅ custom locale with zodiac months
                    // ❌ removed `months` prop — locale handles it now
                    calendarPosition="bottom-right"
                    placeholder={placeholder}
                    inputClass="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700 placeholder-slate-300"
                    containerStyle={{ width: "100%" }}
                />
            </div>

            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PersianDatePicker;