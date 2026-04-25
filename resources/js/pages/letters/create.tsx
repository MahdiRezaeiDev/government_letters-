// resources/js/pages/letters/create.tsx

import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Save, Paperclip, Send, Trash2,
    FileText, Shield,
    Flag, UserCheck,
    User,
    Info, Users, Loader2, Printer,
    MessageSquare, PenLine
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import TextEditor from '@/components/TextEditor';
import { store as LetterCreate } from '@/routes/letters';
import type { LetterCategory, Organization } from '@/types';

interface Props {
    categories: LetterCategory[];
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number }[];
    externalOrganizations?: Organization[];
    securityLevels: Record<string, string>;
    priorityLevels: Record<string, string>;
}

interface FormData {
    category_id: number | null;
    subject: string;
    summary: string;
    content: string;
    security_level: string;
    priority: string;
    date: string;
    recipient_type: 'internal' | 'external';
    recipient_department_id: number | null;
    recipient_position_id: number | null;
    recipient_name: string;
    recipient_position_name: string;
    external_organization_id: number | null;
    external_department_id: number | null;
    external_position_id: number | null;
    instruction: string;
    attachments?: File[];
}

export default function LettersCreate({
    categories, departments, positions, externalOrganizations = [],
    securityLevels, priorityLevels
}: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        category_id: null,
        subject: '',
        summary: '',
        content: '',
        security_level: 'internal',
        priority: 'normal',
        date: new Date().toLocaleDateString('fa-Af'),
        recipient_type: 'internal',
        recipient_department_id: null,
        recipient_position_id: null,
        recipient_name: '',
        recipient_position_name: '',
        external_organization_id: null,
        external_department_id: null,
        external_position_id: null,
        instruction: '',
        attachments: [],
    });

    const [selectedDept, setSelectedDept] = useState<number | null>(null);
    const [availablePositions, setAvailablePositions] = useState<{ id: number; name: string }[]>([]);
    const [selectedExtOrg, setSelectedExtOrg] = useState<number | null>(null);
    const [selectedExtDept, setSelectedExtDept] = useState<number | null>(null);
    const [extDepartments, setExtDepartments] = useState<{ id: number; name: string }[]>([]);
    const [extPositions, setExtPositions] = useState<{ id: number; name: string }[]>([]);

    const [loadingPositions, setLoadingPositions] = useState(false);
    const [loadingExtDepts, setLoadingExtDepts] = useState(false);
    const [loadingExtPositions, setLoadingExtPositions] = useState(false);

    // دریافت پست‌ها هنگام انتخاب دپارتمان داخلی
    useEffect(() => {
        if (selectedDept) {
            setLoadingPositions(true);
            setTimeout(() => {
                setAvailablePositions(positions.filter(p => p.department_id === selectedDept));
                setLoadingPositions(false);
            }, 300);
        } else {
            setAvailablePositions([]);
        }
    }, [selectedDept, positions]);

    // دریافت دپارتمان‌های سازمان خارجی
    useEffect(() => {
        if (selectedExtOrg) {
            setLoadingExtDepts(true);
            axios.get('/organizations/departments', { params: { organization_id: selectedExtOrg } })
                .then(res => {
                    setExtDepartments(res.data.departments || []);
                    setLoadingExtDepts(false);
                })
                .catch(() => {
                    setExtDepartments([]);
                    setLoadingExtDepts(false);
                });
        } else {
            setExtDepartments([]);
            setSelectedExtDept(null);
            setExtPositions([]);
        }
    }, [selectedExtOrg]);

    // دریافت پست‌های دپارتمان خارجی
    useEffect(() => {
        if (selectedExtDept) {
            setLoadingExtPositions(true);
            axios.get('/departments/positions', { params: { department_id: selectedExtDept } })
                .then(res => {
                    setExtPositions(res.data.positions || []);
                    setLoadingExtPositions(false);
                })
                .catch(() => {
                    setExtPositions([]);
                    setLoadingExtPositions(false);
                });
        } else {
            setExtPositions([]);
        }
    }, [selectedExtDept]);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();
        setData('is_draft', isDraft);
        post(LetterCreate(), {
            preserveScroll: true,
            onSuccess: () => {
                if (!isDraft) {
                    reset();
                    setSelectedDept(null);
                    setSelectedExtOrg(null);
                    setSelectedExtDept(null);
                }
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('attachments', [...(data.attachments || []), ...Array.from(e.target.files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setData('attachments', (data.attachments || []).filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) {
            return '0 Bytes';
        }

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getPriorityColor = (key: string): string => {
        const colors: Record<string, string> = {
            low: 'bg-slate-100 text-slate-700',
            normal: 'bg-blue-100 text-blue-700',
            high: 'bg-yellow-100 text-yellow-700',
            urgent: 'bg-orange-100 text-orange-700',
            very_urgent: 'bg-red-100 text-red-700',
        };

        return colors[key] || colors.normal;
    };

    const getPriorityLabel = (key: string): string => {
        const labels: Record<string, string> = {
            low: 'عادی',
            normal: 'معمولی',
            high: 'مهم',
            urgent: 'فوری',
            very_urgent: 'فوقالعاده',
        };

        return labels[key] || 'معمولی';
    };

    const getSecurityColor = (key: string): string => {
        const colors: Record<string, string> = {
            public: 'bg-slate-100 text-slate-700',
            internal: 'bg-blue-100 text-blue-700',
            confidential: 'bg-yellow-100 text-yellow-700',
            secret: 'bg-purple-100 text-purple-700',
            top_secret: 'bg-red-100 text-red-700',
        };

        return colors[key] || colors.internal;
    };

    const getSecurityLabel = (key: string): string => {
        const labels: Record<string, string> = {
            public: 'عمومی',
            internal: 'داخلی',
            confidential: 'محرمانه',
            secret: 'سری',
            top_secret: 'بسیار سری',
        };

        return labels[key] || 'داخلی';
    };

    return (
        <>
            <Head title="ایجاد نامه جدید" />

            <div className="min-h-screen bg-[#f5f6fa]" dir="rtl">
                {/* Header - سبک اداری */}
                <div className="bg-white border-b shadow-lg sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getPriorityColor(data.priority)}`}>
                                    <Flag className="h-3 w-3" />
                                    اولویت: {getPriorityLabel(data.priority)}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getSecurityColor(data.security_level)}`}>
                                    <Shield className="h-3 w-3" />
                                    سطح: {getSecurityLabel(data.security_level)}
                                </div>
                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 flex items-center gap-1.5">
                                    <Users className="h-3 w-3" />
                                    گیرنده: {data.recipient_type === 'internal' ? 'داخلی' : 'خارجی'}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
                                >
                                    <Printer className="h-3.5 w-3.5" />
                                    پیش‌نمایش چاپ
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                    className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    ذخیره پیش‌نویس
                                </button>
                                <button
                                    type="submit"
                                    form="letter-form"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {processing ? 'در حال ارسال...' : 'ثبت و ارسال نامه'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-6">
                    <form id="letter-form" onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="grid grid-cols-12 gap-5">
                            {/* ستون اصلی - فرم */}
                            <div className="col-span-12 lg:col-span-8 space-y-5">

                                {/* کارت اطلاعات اصلی نامه */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <PenLine className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">اطلاعات نامه</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {/* موضوع و تاریخ */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                    موضوع نامه <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.subject}
                                                    onChange={(e) => setData('subject', e.target.value)}
                                                    placeholder="موضوع نامه را وارد نمایید..."
                                                    className="w-full border-slate-300 rounded-md px-3 py-3 border text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                                                />
                                                {errors.subject && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                    تاریخ نامه <span className="text-red-500">*</span>
                                                </label>
                                                <PersianDatePicker
                                                    value={data.date}
                                                    onChange={(date) => setData('date', date as string)}
                                                />
                                                {errors.date && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* خلاصه */}
                                        {/* <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                خلاصه / چکیده
                                            </label>
                                            <textarea
                                                value={data.summary}
                                                onChange={(e) => setData('summary', e.target.value)}
                                                rows={2}
                                                placeholder="خلاصه‌ای از محتوای نامه..."
                                                className="w-full border-slate-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                                            />
                                        </div> */}

                                        {/* متن نامه با TipTap */}
                                        <div>
                                            <TextEditor
                                                content={data.content}
                                                onChange={(content) => setData('content', content)}
                                                placeholder="متن نامه را اینجا بنویسید..."
                                                label="متن نامه"
                                                required={true}
                                                error={errors.content}
                                            />
                                        </div>

                                        {/* دستورالعمل */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                <MessageSquare className="inline h-3.5 w-3.5 ml-1" />
                                                دستورالعمل / توضیحات اجرایی
                                            </label>
                                            <textarea
                                                value={data.instruction}
                                                onChange={(e) => setData('instruction', e.target.value)}
                                                rows={3}
                                                placeholder="دستورالعمل‌های لازم برای گیرنده..."
                                                className="w-full border-slate-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* کارت پیوست‌ها */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">پیوست‌ها</h3>
                                    </div>
                                    <div className="p-5">
                                        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                            <div className="text-center">
                                                <Paperclip className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                                                <p className="text-xs text-slate-500">
                                                    کلیک کنید یا فایل را بکشید و رها کنید
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    PDF, DOC, DOCX, JPG, PNG (حداکثر 10MB)
                                                </p>
                                            </div>
                                            <input type="file" multiple onChange={handleFileChange} className="hidden" />
                                        </label>

                                        {data.attachments && data.attachments.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                                {data.attachments.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md text-sm border">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                            <span className="text-xs text-slate-700 truncate">{file.name}</span>
                                                            <span className="text-[10px] text-slate-400">({formatFileSize(file.size)})</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAttachment(i)}
                                                            className="text-slate-400 hover:text-red-500 transition p-1"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ستون کناری - اطلاعات تکمیلی */}
                            <div className="col-span-12 lg:col-span-4 space-y-5">
                                {/* فرستنده */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">فرستنده</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                                                <span className="text-white text-base font-bold">
                                                    {currentUser.full_name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">
                                                    {currentUser.full_name}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {currentUser.primary_position?.name || 'کاربر'}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {currentUser.department?.name || 'سازمان'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* تنظیمات امنیتی */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">تنظیمات امنیتی</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {/* اولویت */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-slate-600">اولویت</label>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(data.priority)}`}>
                                                    {getPriorityLabel(data.priority)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {[
                                                    { key: 'low', label: 'عادی' },
                                                    { key: 'normal', label: 'معمولی' },
                                                    { key: 'high', label: 'مهم' },
                                                    { key: 'urgent', label: 'فوری' },
                                                    { key: 'very_urgent', label: 'فوق' },
                                                ].map((item) => {
                                                    const isActive = data.priority === item.key;
                                                    const activeClass = {
                                                        low: 'border-slate-500 bg-slate-100 text-slate-800',
                                                        normal: 'border-blue-500 bg-blue-100 text-blue-800',
                                                        high: 'border-yellow-500 bg-yellow-100 text-yellow-800',
                                                        urgent: 'border-orange-500 bg-orange-100 text-orange-800',
                                                        very_urgent: 'border-red-500 bg-red-100 text-red-800',
                                                    };
                                                    const inactiveClass = {
                                                        low: 'border-slate-300 text-slate-600 hover:bg-slate-50',
                                                        normal: 'border-blue-300 text-blue-600 hover:bg-blue-50',
                                                        high: 'border-yellow-300 text-yellow-600 hover:bg-yellow-50',
                                                        urgent: 'border-orange-300 text-orange-600 hover:bg-orange-50',
                                                        very_urgent: 'border-red-300 text-red-600 hover:bg-red-50',
                                                    };

                                                    return (
                                                        <button
                                                            key={item.key}
                                                            type="button"
                                                            onClick={() => setData('priority', item.key)}
                                                            className={`py-2 rounded-md text-[11px] font-medium border transition-all
                                                                ${isActive ? activeClass[item.key] : inactiveClass[item.key]}`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* سطح امنیتی */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-slate-600">سطح امنیتی</label>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSecurityColor(data.security_level)}`}>
                                                    {getSecurityLabel(data.security_level)}
                                                </span>
                                            </div>
                                            <select
                                                value={data.security_level}
                                                onChange={(e) => setData('security_level', e.target.value)}
                                                className="w-full border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="public">عمومی</option>
                                                <option value="internal">داخلی</option>
                                                <option value="confidential">محرمانه</option>
                                                <option value="secret">سری</option>
                                                <option value="top_secret">بسیار سری</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* گیرنده */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">گیرنده</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {/* نوع گیرنده */}
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('recipient_type', 'internal');
                                                    setSelectedExtOrg(null);
                                                }}
                                                className={`flex-1 py-2 text-xs font-medium rounded-md transition border
                                                    ${data.recipient_type === 'internal'
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                                            >
                                                داخلی
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('recipient_type', 'external');
                                                    setSelectedDept(null);
                                                    setData('recipient_department_id', null);
                                                    setData('recipient_position_id', null);
                                                }}
                                                className={`flex-1 py-2 text-xs font-medium rounded-md transition border
                                                    ${data.recipient_type === 'external'
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                                            >
                                                خارج سازمانی
                                            </button>
                                        </div>

                                        {/* گیرنده داخلی */}
                                        {data.recipient_type === 'internal' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        دپارتمان / ریاست
                                                    </label>
                                                    <select
                                                        value={selectedDept || ''}
                                                        onChange={(e) => {
                                                            const id = parseInt(e.target.value) || null;
                                                            setSelectedDept(id);
                                                            setData('recipient_department_id', id);
                                                        }}
                                                        className="w-full border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">انتخاب دپارتمان...</option>
                                                        {departments.map(dept => (
                                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        سمت / عنوان
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.recipient_position_id || ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || null;
                                                                setData('recipient_position_id', id);
                                                                const pos = availablePositions.find(p => p.id === id);
                                                                setData('recipient_position_name', pos?.name || '');
                                                            }}
                                                            className="w-full border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            disabled={!selectedDept || loadingPositions}
                                                        >
                                                            <option value="">انتخاب سمت...</option>
                                                            {availablePositions.map(pos => (
                                                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                            ))}
                                                        </select>
                                                        {loadingPositions && (
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* گیرنده خارجی */}
                                        {data.recipient_type === 'external' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        سازمان
                                                    </label>
                                                    <select
                                                        value={selectedExtOrg || ''}
                                                        onChange={(e) => {
                                                            const id = parseInt(e.target.value) || null;
                                                            setSelectedExtOrg(id);
                                                            setData('external_organization_id', id);
                                                        }}
                                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">انتخاب سازمان...</option>
                                                        {externalOrganizations.map(org => (
                                                            <option key={org.id} value={org.id}>{org.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        دپارتمان
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={selectedExtDept || ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || null;
                                                                setSelectedExtDept(id);
                                                                setData('external_department_id', id);
                                                            }}
                                                            className="border w-full border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            disabled={!selectedExtOrg || loadingExtDepts}
                                                        >
                                                            <option value="">انتخاب دپارتمان...</option>
                                                            {extDepartments.map(dept => (
                                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                            ))}
                                                        </select>
                                                        {loadingExtDepts && (
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        سمت
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.external_position_id || ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || null;
                                                                setData('external_position_id', id);
                                                                const pos = extPositions.find(p => p.id === id);
                                                                setData('recipient_position_name', pos?.name || '');
                                                            }}
                                                            className="border w-full border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            disabled={!selectedExtDept || loadingExtPositions}
                                                        >
                                                            <option value="">انتخاب سمت...</option>
                                                            {extPositions.map(pos => (
                                                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                            ))}
                                                        </select>
                                                        {loadingExtPositions && (
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* خلاصه وضعیت نامه */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">خلاصه وضعیت</h3>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">اولویت:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(data.priority)}`}>
                                                {getPriorityLabel(data.priority)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">سطح امنیتی:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSecurityColor(data.security_level)}`}>
                                                {getSecurityLabel(data.security_level)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">تاریخ:</span>
                                            <span className="text-xs font-medium text-slate-700">{data.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">گیرنده:</span>
                                            <span className="text-xs font-medium text-slate-700">
                                                {data.recipient_type === 'internal' ? 'داخلی' : 'خارج سازمانی'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* راهنما */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-blue-800">
                                            <p className="font-medium mb-1">راهنمای ثبت نامه</p>
                                            <ul className="space-y-1 text-blue-700">
                                                <li>• فیلدهای ستاره‌دار الزامی هستند</li>
                                                <li>• پس از ثبت، نامه به کارتابل گیرنده ارسال می‌شود</li>
                                                <li>• می‌توانید نامه را به صورت پیش‌نویس ذخیره کنید</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}