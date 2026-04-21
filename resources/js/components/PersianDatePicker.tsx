import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import opacity from "react-element-popper/animations/opacity";

export default function PersianDatePicker({ value, onChange, label, error }) {
    return (
        <div className="flex flex-col w-full">
            {label && <label className="text-xs font-bold text-slate-500 mb-2">{label}</label>}
            
            <DatePicker
                value={value}
                onChange={(date) => {
                    // تبدیل تاریخ به فرمت استاندارد برای ارسال به لاراول (YYYY/MM/DD)
                    onChange(date ? date.format("YYYY/MM/DD") : "");
                }}
                calendar={persian}
                locale={persian_fa}
                animations={[opacity()]}
                calendarPosition="bottom-right"
                // استایل‌دهی به اینپوت (هماهنگ با طراحی قبلی شما)
                inputClass="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                containerStyle={{ width: "100%" }}
            />
            
            {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
        </div>
    );
}