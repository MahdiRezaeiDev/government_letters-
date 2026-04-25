import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, Paperclip, Trash2,
    FileText, Shield,
    Flag, UserCheck,
    User,
    Info, Loader2, ArrowLeft, Printer,
    PenLine, X, Download, History
} from 'lucide-react';
import React, { useState } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import TextEditor from '@/components/TextEditor';
import { update as LetterUpdate } from '@/routes/letters';
import type { LetterCategory, Organization, Letter, Attachment } from '@/types';

interface Props {
    letter: Letter & { attachments: Attachment[] };
    categories: LetterCategory[];
    users: {
        id: number;
        name: string;
        position: string | null;
        department: string | null;
        department_id?: number;
        position_id?: number;
    }[];
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number }[];
    externalOrganizations: Organization[];
    externalOrganizationsTree: Organization[];
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
    due_date: string | null;
    response_deadline: string | null;
    sheet_count: number;
}

export default function LettersEdit({
    letter,
    categories,
    securityLevels,
    priorityLevels
}: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const { data, setData, processing, errors, reset } = useForm<FormData>({
        category_id: letter.category_id,
        subject: letter.subject,
        summary: letter.summary || '',
        content: letter.content || '',
        security_level: letter.security_level,
        priority: letter.priority,
        date: letter.date.split('T')[0],
        due_date: letter.due_date ? letter.due_date.split('T')[0] : null,
        response_deadline: letter.response_deadline ? letter.response_deadline.split('T')[0] : null,
        sheet_count: letter.sheet_count || 1,
    });

    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState(letter.attachments || []);
    const [deletedAttachments, setDeletedAttachments] = useState<number[]>([]);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();

        const formData = new FormData();

        // اطلاعات پایه
        formData.append('category_id', String(data.category_id || ''));
        formData.append('subject', data.subject);
        formData.append('summary', data.summary);
        formData.append('content', data.content);
        formData.append('security_level', data.security_level);
        formData.append('priority', data.priority);
        formData.append('date', data.date);
        formData.append('due_date', data.due_date || '');
        formData.append('response_deadline', data.response_deadline || '');
        formData.append('sheet_count', String(data.sheet_count));
        formData.append('is_draft', String(isDraft));

        // پیوست‌های جدید
        attachments.forEach(file => {
            formData.append('new_attachments[]', file);
        });

        // پیوست‌های حذف شده
        deletedAttachments.forEach(id => {
            formData.append('deleted_attachments[]', String(id));
        });

        // متد PUT برای به‌روزرسانی
        formData.append('_method', 'PUT');

        router.post(LetterUpdate({ letter: letter.id }), formData, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAttachments([]);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments([...attachments, ...Array.from(e.target.files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const removeExistingAttachment = (id: number) => {
        setDeletedAttachments([...deletedAttachments, id]);
        setExistingAttachments(existingAttachments.filter(att => att.id !== id));
    };

    const downloadAttachment = (attachment: Attachment) => {
        window.open(route('attachments.download', { attachment: attachment.id }), '_blank');
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
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

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="utf-8">
                <title>پیش‌نمایش نامه - ${letter.letter_number}</title>
                <script src="https://cdn.tailwindcss.com"><\/script>
                <style>
                    @page { size: A4; margin: 20mm; }
                    body { font-family: Tahoma, sans-serif; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body class="bg-white p-8">
                <div class="no-print mb-4 flex gap-2">
                    <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded">چاپ</button>
                    <button onclick="window.close()" class="px-4 py-2 bg-slate-200 rounded">بستن</button>
                </div>
                
                <div style="max-width: 170mm; margin: 0 auto;">
                    <div style="border-bottom: 2px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <h1 style="font-size: 20px; font-weight: bold;">نامه رسمی</h1>
                                <p style="font-size: 12px; color: #64748b;">شماره: ${letter.letter_number || '---'}</p>
                            </div>
                            <div style="text-align: left;">
                                <p style="font-size: 12px;">تاریخ: ${data.date}</p>
                                <p style="font-size: 12px;">پیوست: ${existingAttachments.length > 0 ? 'دارد' : 'ندارد'}</p>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <p style="font-size: 12px;">از: ${currentUser.full_name}</p>
                        <p style="font-size: 12px;">${currentUser.department?.name} - ${currentUser.primary_position?.name}</p>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <p style="font-size: 12px;">به: ${letter.recipient_name || '---'}</p>
                    </div>

                    <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">
                            موضوع: ${data.subject || '---'}
                        </h2>
                    </div>

                    <div style="margin-bottom: 32px; line-height: 1.8; font-size: 13px;">
                        ${data.content || '<p style="color: #94a3b8;">متنی وارد نشده است...</p>'}
                    </div>

                    ${data.summary ? `
                    <div style="margin-bottom: 24px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <p style="font-size: 11px; font-weight: bold;">خلاصه:</p>
                        <p style="font-size: 12px;">${data.summary}</p>
                    </div>
                    ` : ''}

                    <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <p style="font-size: 12px;">فرستنده:</p>
                                <p style="font-size: 14px; font-weight: bold; margin-top: 8px;">${currentUser.full_name}</p>
                                <p style="font-size: 12px;">${currentUser.primary_position?.name}</p>
                            </div>
                            <div style="text-align: center;">
                                <p style="font-size: 12px; margin-bottom: 32px;">مهر و امضا</p>
                                <div style="width: 128px; height: 128px; border: 2px dashed #e2e8f0; display: flex; align-items: center; justify-content: center;">
                                    <p style="font-size: 11px; color: #94a3b8;">جای مهر</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    return (
        <>
            <Head title={`ویرایش نامه - ${letter.subject}`} />

            <div className="min-h-screen bg-[#f5f6fa]" dir="rtl">
                {/* Header - سبک اداری */}
                <div className="bg-white border-b shadow-lg sticky top-0 z-30 print:hidden">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => window.history.back()}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                                </button>
                                <div className="h-10 w-1 bg-amber-600 rounded-full"></div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800">ویرایش نامه</h1>
                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                        <span className="font-medium">{letter.letter_number}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-slate-400">شناسه: {letter.tracking_number}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <History className="h-3.5 w-3.5" />
                                <span>آخرین ویرایش: {letter.updated_at ? new Date(letter.updated_at).toLocaleDateString('fa-IR') : '---'}</span>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-3 border-t">
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
                                    <FileText className="h-3 w-3" />
                                    شماره: {letter.letter_number || 'پیش‌نویس'}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPrintPreview(true)}
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
                                    className="px-6 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-6 print:hidden">
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
                                                    className="w-full border-slate-300 rounded-md px-3 py-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
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
                                            </div>
                                        </div>

                                        {/* خلاصه */}
                                        <div>
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
                                        </div>

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
                                    </div>
                                </div>

                                {/* کارت پیوست‌ها */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">پیوست‌ها</h3>
                                    </div>
                                    <div className="p-5">
                                        {/* پیوست‌های موجود */}
                                        {existingAttachments.length > 0 && (
                                            <div className="mb-4 space-y-1.5">
                                                <h4 className="text-xs font-medium text-slate-600 mb-2">پیوست‌های فعلی</h4>
                                                {existingAttachments.map((attachment) => (
                                                    <div key={attachment.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md text-sm border">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                            <span className="text-xs text-slate-700 truncate">{attachment.file_name}</span>
                                                            <span className="text-[10px] text-slate-400">({formatFileSize(attachment.file_size)})</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => downloadAttachment(attachment)}
                                                                className="text-slate-400 hover:text-blue-500 transition p-1"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingAttachment(attachment.id)}
                                                                className="text-slate-400 hover:text-red-500 transition p-1"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* آپلود پیوست جدید */}
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

                                        {/* پیوست‌های جدید */}
                                        {attachments.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                                <h4 className="text-xs font-medium text-slate-600">پیوست‌های جدید</h4>
                                                {attachments.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2.5 bg-blue-50 rounded-md text-sm border border-blue-200">
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
                                            <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
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

                                {/* گیرنده (فقط خواندنی) */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">گیرنده</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                                                <span className="text-white text-base font-bold">
                                                    {letter.recipient_name?.charAt(0) || '؟'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">
                                                    {letter.recipient_name || 'نامشخص'}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {letter.recipient_position_name || 'بدون سمت'}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {letter.recipient_type === 'external' ? 'خارج سازمانی' : 'داخلی'}
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

                                {/* خلاصه وضعیت نامه */}
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="px-5 py-3 border-b bg-slate-50/50 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">خلاصه وضعیت</h3>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">شماره نامه:</span>
                                            <span className="text-xs font-medium text-slate-700">{letter.letter_number || 'پیش‌نویس'}</span>
                                        </div>
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
                                                {letter.recipient_type === 'external' ? 'خارج سازمانی' : 'داخلی'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">تعداد پیوست:</span>
                                            <span className="text-xs font-medium text-slate-700">{existingAttachments.length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* راهنما */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-amber-800">
                                            <p className="font-medium mb-1">راهنمای ویرایش نامه</p>
                                            <ul className="space-y-1 text-amber-700">
                                                <li>• فیلدهای ستاره‌دار الزامی هستند</li>
                                                <li>• پیوست‌های حذف شده قابل بازیابی نیستند</li>
                                                <li>• پس از ذخیره، تغییرات در تاریخچه ثبت می‌شود</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal پیش‌نمایش چاپ */}
            {showPrintPreview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-lg font-bold text-slate-800">پیش‌نمایش چاپ</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-2"
                                >
                                    <Printer className="h-4 w-4" />
                                    چاپ
                                </button>
                                <button
                                    onClick={() => setShowPrintPreview(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <X className="h-5 w-5 text-slate-600" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8 bg-slate-100">
                            <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
                                {/* محتوای پیش‌نمایش */}
                                <div className="border-b-2 border-slate-800 pb-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-xl font-bold text-slate-900">نامه رسمی</h1>
                                            <p className="text-sm text-slate-600 mt-1">شماره: {letter.letter_number || 'پیش‌نویس'}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm text-slate-600">تاریخ: {data.date}</p>
                                            <p className="text-sm text-slate-600">پیوست: {existingAttachments.length > 0 ? 'دارد' : 'ندارد'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <p className="text-sm text-slate-600">از: {currentUser.full_name}</p>
                                    <p className="text-sm text-slate-600">{currentUser.department?.name} - {currentUser.primary_position?.name}</p>
                                </div>
                                <div className="mb-6">
                                    <p className="text-sm text-slate-600">به: {letter.recipient_name || '---'}</p>
                                </div>
                                <div className="mb-4 pb-4 border-b">
                                    <h2 className="text-lg font-bold text-slate-900 mb-2">موضوع: {data.subject || '---'}</h2>
                                    <div className="flex gap-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(data.priority)}`}>
                                            اولویت: {getPriorityLabel(data.priority)}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSecurityColor(data.security_level)}`}>
                                            {getSecurityLabel(data.security_level)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-8 leading-relaxed text-sm">
                                    {data.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: data.content }} />
                                    ) : (
                                        <p className="text-slate-400 italic">متنی وارد نشده است...</p>
                                    )}
                                </div>
                                <div className="mt-12 border-t pt-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-slate-600">فرستنده:</p>
                                            <p className="text-base font-bold text-slate-900 mt-2">{currentUser.full_name}</p>
                                            <p className="text-sm text-slate-600">{currentUser.primary_position?.name}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-slate-600 mb-8">مهر و امضا</p>
                                            <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                                                <p className="text-xs text-slate-400">جای مهر</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 pt-4 border-t text-center">
                                    <p className="text-xs text-slate-400">این نامه توسط سیستم مکاتبات اداری به صورت خودکار ثبت شده است</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}