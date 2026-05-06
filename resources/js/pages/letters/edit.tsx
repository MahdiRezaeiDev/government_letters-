import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, Paperclip, Trash2,
    FileText, Shield,
    UserCheck, User,
    Info, Loader2,
    PenLine, X, Download, History, Printer, Tag, Send
} from 'lucide-react';
import React, { useState } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import TextEditor from '@/components/TextEditor';
import { update as LetterUpdate } from '@/routes/letters';
import type { LetterCategory, Organization, Letter, Attachment } from '@/types';

const inputClass = "w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white";

interface PriorityLevel {
    label: string;
    activeColor: string;
    inactiveColor: string;
}

interface SecurityLevel {
    label: string;
    color: string;
    activeColor: string;
    inactiveColor: string;
}

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
    securityLevels: Record<string, SecurityLevel>;
    priorityLevels: Record<string, PriorityLevel>;
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
    securityLevels,
    priorityLevels,
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

        attachments.forEach(file => formData.append('new_attachments[]', file));
        deletedAttachments.forEach(id => formData.append('deleted_attachments[]', String(id)));
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

    const removeAttachment = (index: number) =>
        setAttachments(attachments.filter((_, i) => i !== index));

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

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="utf-8">
                <title>پیش‌نمایش مکتوب - ${letter.letter_number}</title>
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
                                <h1 style="font-size: 20px; font-weight: bold;">مکتوب رسمی</h1>
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
                        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">موضوع: ${data.subject || '---'}</h2>
                    </div>
                    <div style="margin-bottom: 32px; line-height: 1.8; font-size: 13px;">
                        ${data.content || '<p style="color: #94a3b8;">متنی وارد نشده است...</p>'}
                    </div>
                    ${data.summary ? `
                    <div style="margin-bottom: 24px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <p style="font-size: 11px; font-weight: bold;">خلاصه:</p>
                        <p style="font-size: 12px;">${data.summary}</p>
                    </div>` : ''}
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
            <Head title={`ویرایش مکتوب - ${letter.subject}`} />

            <div className="min-h-screen">

                {/* ─── Body ─── */}
                <div className="max-w-7xl mx-auto px-3 lg:px-6 py-6">
                    <form id="letter-form" onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="grid grid-cols-12 gap-5">

                            {/* ══ ستون اصلی ══ */}
                            <div className="col-span-12 lg:col-span-8 space-y-5">

                                {/* سربرگ */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                            <Tag className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-800">ویرایش مکتوب</h2>
                                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                                <span className="font-medium text-slate-500">{letter.letter_number}</span>
                                                <span className="text-slate-300">|</span>
                                                <History className="h-3 w-3" />
                                                <span>آخرین ویرایش: {letter.updated_at ? new Date(letter.updated_at).toLocaleDateString('fa-IR') : '---'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPrintPreview(true)}
                                        className="cursor-pointer px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1.5"
                                    >
                                        <Printer className="h-3.5 w-3.5" />
                                        پیش‌نمایش چاپ
                                    </button>
                                </div>

                                {/* اطلاعات نامه */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <PenLine className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">معلومات مکتوب</h3>
                                    </div>
                                    <div className="p-5 space-y-4">

                                        {/* موضوع + تاریخ */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                    موضوع مکتوب <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.subject}
                                                    onChange={(e) => setData('subject', e.target.value)}
                                                    placeholder="موضوع مکتوب را وارد نمایید..."
                                                    className={`${inputClass} py-3 placeholder:text-slate-400`}
                                                />
                                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                    تاریخ مکتوب <span className="text-red-500">*</span>
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
                                                placeholder="خلاصه‌ای از محتوای مکتوب..."
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>

                                        {/* متن نامه */}
                                        <div>
                                            <TextEditor
                                                content={data.content}
                                                onChange={(content) => setData('content', content)}
                                                placeholder="متن مکتوب را اینجا بنویسید..."
                                                label="متن مکتوب"
                                                required={true}
                                                error={errors.content}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* پیوست‌ها */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">ضمایم</h3>
                                    </div>
                                    <div className="p-5">

                                        {/* پیوست‌های موجود */}
                                        {existingAttachments.length > 0 && (
                                            <div className="mb-4 space-y-1.5">
                                                <h4 className="text-xs font-medium text-slate-600 mb-2">ضمایم فعلی</h4>
                                                {existingAttachments.map((attachment) => (
                                                    <div key={attachment.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                            <span className="text-xs text-slate-700 truncate">{attachment.file_name}</span>
                                                            <span className="text-[10px] text-slate-400">({formatFileSize(attachment.file_size)})</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button type="button" onClick={() => downloadAttachment(attachment)}
                                                                className="text-slate-400 hover:text-blue-500 transition p-1">
                                                                <Download className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button type="button" onClick={() => removeExistingAttachment(attachment.id)}
                                                                className="text-slate-400 hover:text-red-500 transition p-1">
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* آپلود پیوست جدید */}
                                        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                            <Paperclip className="h-5 w-5 text-slate-400 mb-1" />
                                            <p className="text-xs text-slate-500">کلیک کنید یا فایل را بکشید و رها کنید</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOC, DOCX, JPG, PNG (حداکثر 10MB)</p>
                                            <input type="file" multiple onChange={handleFileChange}
                                                className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                        </label>

                                        {/* پیوست‌های جدید */}
                                        {attachments.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                                <h4 className="text-xs font-medium text-slate-600">ضمایم جدید</h4>
                                                {attachments.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-md">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                            <span className="text-xs text-slate-700 truncate">{file.name}</span>
                                                            <span className="text-[10px] text-slate-400">({formatFileSize(file.size)})</span>
                                                        </div>
                                                        <button type="button" onClick={() => removeAttachment(i)}
                                                            className="text-slate-400 hover:text-red-500 transition p-1">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* دکمه‌های دسکتاپ */}
                                <div className="hidden md:flex gap-5 col-span-12 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden p-5">
                                    <button type="submit" form="letter-form" disabled={processing}
                                        className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </button>
                                    <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={processing}
                                        className="cursor-pointer px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                        <Save className="h-4 w-4" /> پیش‌نویس
                                    </button>
                                </div>
                            </div>

                            {/* ══ ستون کناری ══ */}
                            <div className="col-span-12 lg:col-span-4 space-y-5">

                                {/* فرستنده */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">فرستنده</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                                <span className="text-white text-sm font-bold">
                                                    {currentUser.full_name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{currentUser.full_name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{currentUser.primary_position?.name || 'کاربر'}</p>
                                                <p className="text-xs text-slate-400">{currentUser.department?.name || 'وزارت'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* گیرنده (فقط خواندنی) */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">گیرنده</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                                <span className="text-white text-sm font-bold">
                                                    {letter.recipient_name?.charAt(0) || '؟'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{letter.recipient_name || 'نامشخص'}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{letter.recipient_position_name || 'بدون بست'}</p>
                                                <p className="text-xs text-slate-400">
                                                    {letter.recipient_type === 'external' ? 'خارج از وزارت' : 'داخلی'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* تنظیمات امنیتی */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">تنظیمات امنیتی</h3>
                                    </div>
                                    <div className="p-5 space-y-4">

                                        {/* اولویت */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-slate-600">اولویت</label>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityLevels[data.priority]?.activeColor.split(' ').slice(0, 2).join(' ')}`}>
                                                    {priorityLevels[data.priority]?.label ?? 'معمولی'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {Object.entries(priorityLevels).map(([key, value]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setData('priority', key)}
                                                        className={`py-2 rounded-md text-[11px] font-medium border transition-all
                                                            ${data.priority === key ? value.activeColor : value.inactiveColor}`}
                                                    >
                                                        {value.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* سطح امنیتی */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-slate-600">سطح امنیتی</label>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${securityLevels[data.security_level]?.color ?? 'bg-blue-100 text-blue-700'}`}>
                                                    {securityLevels[data.security_level]?.label ?? 'داخلی'}
                                                </span>
                                            </div>
                                            <select
                                                value={data.security_level}
                                                onChange={(e) => setData('security_level', e.target.value)}
                                                className={inputClass}
                                            >
                                                {Object.entries(securityLevels).map(([key, value]) => (
                                                    <option key={key} value={key}>{value.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* خلاصه وضعیت */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">خلاصه وضعیت</h3>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">شماره مکتوب :</span>
                                            <span className="text-xs font-medium text-slate-700">{letter.letter_number || 'پیش‌نویس'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">اولویت:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityLevels[data.priority]?.activeColor.split(' ').slice(0, 2).join(' ')}`}>
                                                {priorityLevels[data.priority]?.label ?? 'معمولی'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">سطح امنیتی:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${securityLevels[data.security_level]?.activeColor ?? 'bg-blue-100 text-blue-700'}`}>
                                                {securityLevels[data.security_level]?.label ?? 'داخلی'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">تاریخ:</span>
                                            <span className="text-xs font-medium text-slate-700">{data.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">گیرنده:</span>
                                            <span className="text-xs font-medium text-slate-700">
                                                {letter.recipient_type === 'external' ? 'خارج از وزارت' : 'داخلی'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">تعداد ضمایم:</span>
                                            <span className="text-xs font-medium text-slate-700">{existingAttachments.length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* راهنما */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 overflow-hidden">
                                    <div className="flex items-start gap-2">
                                        <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-amber-800">
                                            <p className="font-medium mb-1">راهنمای ویرایش مکتوب</p>
                                            <ul className="space-y-1 text-amber-700">
                                                <li>• فیلدهای ستاره‌دار الزامی هستند</li>
                                                <li>• ضمایم حذف شده قابل بازیابی نیستند</li>
                                                <li>• پس از ذخیره، تغییرات در تاریخچه ثبت می‌شود</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* دکمه‌های موبایل */}
                            <div className="md:hidden col-span-12 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex justify-between p-5">
                                <button type="submit" form="letter-form" disabled={processing}
                                    className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                                <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={processing}
                                    className="cursor-pointer px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                    <Save className="h-4 w-4" /> پیش‌نویس
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal پیش‌نمایش چاپ */}
            {showPrintPreview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-sm font-bold text-slate-800">پیش‌نمایش چاپ</h2>
                            <div className="flex gap-2">
                                <button onClick={handlePrint}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition flex items-center gap-2">
                                    <Printer className="h-3.5 w-3.5" />
                                    چاپ
                                </button>
                                <button onClick={() => setShowPrintPreview(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition">
                                    <X className="h-4 w-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8 bg-slate-100">
                            <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
                                <div className="border-b-2 border-slate-800 pb-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-xl font-bold text-slate-900">مکتوب رسمی</h1>
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
                                </div>
                                <div className="mb-8 leading-relaxed text-sm">
                                    {data.content
                                        ? <div dangerouslySetInnerHTML={{ __html: data.content }} />
                                        : <p className="text-slate-400 italic">متنی وارد نشده است...</p>
                                    }
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}