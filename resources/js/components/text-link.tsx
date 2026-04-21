import { Calendar, X, ChevronDown, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/green.css';

interface PersianDatePickerProps {
    value?: string | string[] | null;
    onChange: (date: string | string[] | null) => void;
    placeholder?: string;
    label?: string;
    mode?: 'single' | 'multiple' | 'range';
    required?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string | null;
    format?: string;
}

export default function PersianDatePicker({
    value,
    onChange,
    placeholder = 'انتخاب تاریخ',
    label,
    mode = 'single',
    required = false,
    disabled = false,
    className = '',
    error = null,
    format = 'YYYY/MM/DD'
}: PersianDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // تبدیل مقدار به فرمت مورد نیاز DatePicker
    const getPickerValue = () => {
        if (!value) {
return null;
}

        if (mode === 'single' && typeof value === 'string') {
            return value;
        } else if (mode === 'multiple' && Array.isArray(value)) {
            return value;
        } else if (mode === 'range' && typeof value === 'string') {
            const [from, to] = value.split(' - ');

            return { from, to };
        }

        return null;
    };

    // تبدیل تاریخ انتخاب شده به فرمت خروجی
    const handleChange = (date: any) => {
        if (!date) {
            onChange(null);
            setIsOpen(false);

            return;
        }

        if (mode === 'single') {
            const formattedDate = date.format?.(format) || String(date);
            onChange(formattedDate);
        } else if (mode === 'multiple' && Array.isArray(date)) {
            const formattedDates = date.map((d: any) => d.format?.(format) || String(d));
            onChange(formattedDates);
        } else if (mode === 'range' && Array.isArray(date) && date.length === 2) {
            const from = date[0].format?.(format) || String(date[0]);
            const to = date[1].format?.(format) || String(date[1]);
            onChange(`${from} - ${to}`);
        }

        setIsOpen(false);
    };

    const clearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    const displayValue = () => {
        if (!value) {
return '';
}

        if (mode === 'single' && typeof value === 'string') {
return value;
}

        if (mode === 'range' && typeof value === 'string') {
return value;
}

        if (mode === 'multiple' && Array.isArray(value) && value.length > 0) {
            return `${value.length} تاریخ انتخاب شده`;
        }

        return '';
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {label}
                    {required && <span className="text-rose-400 mr-1">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 cursor-pointer ${disabled ? 'opacity-60 bg-slate-50 cursor-not-allowed' :
                            error ? 'border-rose-300 ring-1 ring-rose-300' :
                                'border-slate-200 hover:border-slate-300'
                        }`}
                >
                    <Calendar className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <div className="w-full pr-10 pl-4 py-3 text-sm text-slate-700">
                        {displayValue() || placeholder}
                    </div>
                    {value && (
                        <button
                            type="button"
                            onClick={clearDate}
                            className="absolute left-3.5 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDown className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {isOpen && !disabled && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={getPickerValue()}
                            onChange={handleChange}
                            multiple={mode === 'multiple'}
                            range={mode === 'range'}
                            format={format}
                            className="rmdp-green"
                            inputClass="hidden"
                            containerClassName="shadow-xl border border-slate-100 rounded-xl overflow-hidden"
                            weekDays={['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']}
                            months={[
                                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
                            ]}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                )}
            </div>

            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {error}
                </p>
            )}
        </div>
    );
}