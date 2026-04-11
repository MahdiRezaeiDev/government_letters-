import React, { useState } from 'react';
import { DatePicker, RangePicker } from 'react-persian-range-picker';
import 'react-persian-range-picker/dist/styles.css';

interface PersianDatePickerProps {
    value?: string | string[] | null;
    onChange: (date: string | string[] | null) => void;
    placeholder?: string;
    label?: string;
    mode?: 'single' | 'multiple' | 'range';
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function PersianDatePicker({ 
    value, 
    onChange, 
    placeholder = 'انتخاب تاریخ', 
    label,
    mode = 'single',
    required = false,
    disabled = false,
    className = ''
}: PersianDatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<string | string[] | null>(value || null);

    const handleChange = (date: any) => {
        let formattedDate: string | string[] | null = null;
        
        if (mode === 'single') {
            formattedDate = date?.format('jYYYY-jMM-jDD') || null;
        } else if (mode === 'multiple' && Array.isArray(date)) {
            formattedDate = date.map((d: any) => d.format('jYYYY-jMM-jDD'));
        } else if (mode === 'range' && date?.from && date?.to) {
            formattedDate = `${date.from.format('jYYYY-jMM-jDD')} - ${date.to.format('jYYYY-jMM-jDD')}`;
        }
        
        setSelectedDate(formattedDate);
        onChange(formattedDate);
    };

    // تبدیل مقدار ورودی به فرمت مورد نیاز کتابخانه
    const getPickerValue = () => {
        if (!value) return null;
        
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

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </label>
            )}
            
            {mode === 'range' ? (
                <RangePicker
                    value={getPickerValue()}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <DatePicker
                    value={getPickerValue()}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    multiple={mode === 'multiple'}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
        </div>
    );
}