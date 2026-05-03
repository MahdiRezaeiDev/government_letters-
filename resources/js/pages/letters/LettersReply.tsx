import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Save, Paperclip, Send, Trash2, FileText, Shield,
    UserCheck, Info, Loader2, PenLine, CornerUpLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import TextEditor from '@/components/TextEditor';
import LetterRoute from '@/routes/letters';
import type { LetterCategory, Organization, Letter } from '@/types';

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
    categories: LetterCategory[];
    departments: { id: number; name: string }[];
    positions: {
        id: number;
        name: string;
        department_id: number;
        user_id?: number;
        user_name?: string;
    }[];
    externalOrganizations?: Organization[];
    securityLevels: Record<string, SecurityLevel>;
    priorityLevels: Record<string, PriorityLevel>;
    originalLetter: Letter;
}

export default function LettersReply({
    positions,
    securityLevels,
    priorityLevels,
    originalLetter,
}: Props) {
    const { auth } = usePage().props as any;

    const isOriginalInternal = originalLetter.letter_type === 'internal';

    const defaultRecipientType = isOriginalInternal ? 'internal' : 'external';

    const defaultRecipient = {
        type: defaultRecipientType,
        organization_id: isOriginalInternal ? originalLetter.organization_id || originalLetter.recipient_organization_id : null,
        department_id: isOriginalInternal ? originalLetter.sender_department_id : null,
        position_id: isOriginalInternal ? originalLetter.sender_position_id : null,
        user_id: isOriginalInternal ? originalLetter.sender_user_id : null,
        name: isOriginalInternal ? originalLetter.sender_name : originalLetter.sender_organization?.name,
        position_name: isOriginalInternal ? originalLetter.sender_position_name : originalLetter.sender_position_name,
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: originalLetter.category_id || null,
        subject: `پاسخ به: ${originalLetter.subject}`,
        content: `\n\n\n\n---\n**نامه اصلی:**\n${originalLetter.content || ''}`,
        security_level: originalLetter.security_level || 'internal',
        priority: originalLetter.priority || 'normal',
        date: new Date().toLocaleDateString('fa-IR', { calendar: 'persian', year: 'numeric', month: '2-digit', day: '2-digit' }),
        attachments: [],
        is_draft: false,
        recipient_type: defaultRecipient.type,
        recipient_organization_id: defaultRecipient.organization_id,
        recipient_department_id: defaultRecipient.department_id,
        recipient_position_id: defaultRecipient.position_id,
        recipient_user_id: defaultRecipient.user_id,
        recipient_name: defaultRecipient.name || '',
        recipient_position_name: defaultRecipient.position_name || '',
        reply_to_letter_id: originalLetter.id,
        parent_letter_id: originalLetter.parent_letter_id || originalLetter.id,
    });

    const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();
        post(LetterRoute.reply.store({ letter: originalLetter.id }).url, {
            data: { ...data, is_draft: isDraft, reply_to_letter_id: originalLetter.id },
            preserveScroll: true,
            onSuccess: () => {
                if (!isDraft) {
                    reset();
                }
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('attachments', [...data.attachments, ...Array.from(e.target.files)]);
        }
    };

    const removeAttachment = (index: number) =>
        setData('attachments', data.attachments.filter((_, i) => i !== index));

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) {
            return '0 Bytes';
        }

        const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            <Head title={`پاسخ به: ${originalLetter.subject}`} />

            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-3 lg:px-6 py-6">
                    <form id="reply-form" onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="grid grid-cols-12 gap-5">

                            {/* ══ ستون اصلی ══ */}
                            <div className="col-span-12 lg:col-span-8 space-y-5">

                                {/* سربرگ */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <CornerUpLeft className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">پاسخ به مکتوب</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            شماره: <span className="font-medium text-slate-500">{originalLetter.letter_number}</span>
                                            <span className="mx-1.5 text-slate-300">|</span>
                                            تاریخ: <span dir='ltr'> {originalLetter.date}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* خلاصه مکتوب اصلی */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                                    <FileText className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-emerald-800 mb-1">مکتوب اصلی:</p>
                                        <p className="text-xs text-emerald-700 truncate">{originalLetter.subject}</p>
                                        <p className="text-[10px] text-emerald-600 mt-1">
                                            فرستنده: {originalLetter.sender_name}
                                            {originalLetter.sender_position_name && ` — ${originalLetter.sender_position_name}`}
                                        </p>
                                    </div>
                                </div>

                                {/* متن پاسخ */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <PenLine className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">متن پاسخ</h3>
                                    </div>
                                    <div className="p-5 space-y-4">

                                        {/* موضوع + تاریخ */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                    موضوع <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.subject}
                                                    onChange={(e) => setData('subject', e.target.value)}
                                                    className={`${inputClass} py-3 placeholder:text-slate-400`}
                                                />
                                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                                    تاریخ <span className="text-red-500">*</span>
                                                </label>
                                                <PersianDatePicker
                                                    value={data.date}
                                                    onChange={(date) => setData('date', date as string)}
                                                />
                                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                            </div>
                                        </div>

                                        {/* محتوا */}
                                        <div>
                                            <TextEditor
                                                content={data.content}
                                                onChange={(content) => setData('content', content)}
                                                placeholder="متن پاسخ را بنویسید..."
                                                label="متن پاسخ"
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
                                        <h3 className="text-sm font-bold text-slate-700">پیوست‌ها</h3>
                                    </div>
                                    <div className="p-5">
                                        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                            <Paperclip className="h-5 w-5 text-slate-400 mb-1" />
                                            <p className="text-xs text-slate-500">کلیک کنید یا فایل را بکشید و رها کنید</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOC, DOCX, JPG, PNG (حداکثر 10MB)</p>
                                            <input type="file" multiple onChange={handleFileChange}
                                                className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                        </label>

                                        {data.attachments.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                                {data.attachments.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-md">
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
                                <div className="hidden md:flex gap-5 bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                                    <button type="submit" form="reply-form" disabled={processing}
                                        className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        {processing ? 'در حال ارسال...' : 'ارسال پاسخ'}
                                    </button>
                                    <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={processing}
                                        className="cursor-pointer px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                        <Save className="h-4 w-4" /> پیش‌نویس
                                    </button>
                                </div>
                            </div>

                            {/* ══ ستون کناری ══ */}
                            <div className="col-span-12 lg:col-span-4 space-y-5">

                                {/* گیرنده (فقط خواندنی) */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">گیرنده</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                                <span className="text-white text-sm font-bold">
                                                    {data.recipient_name?.charAt(0) || '؟'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{data.recipient_name || 'نامشخص'}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{data.recipient_position_name || 'بدون سمت'}</p>
                                                <p className="text-xs text-slate-400">
                                                    {data.recipient_type === 'internal' ? 'داخلی' : 'خارج سازمانی'}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 text-center bg-slate-50 rounded-md py-1.5">
                                            گیرنده بر اساس مکتوب اصلی تعیین شده است
                                        </p>
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
                                        <h3 className="text-sm font-bold text-slate-700">اطلاعات مکتوب اصلی</h3>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">شماره:</span>
                                            <code className="text-xs font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{originalLetter.letter_number}</code>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">تاریخ:</span>
                                            <span className="text-xs font-medium text-slate-700">
                                                {originalLetter.date}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">فرستنده:</span>
                                            <span className="text-xs font-medium text-slate-700">{originalLetter.sender_name}</span>
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
                                        <div className="pt-2 border-t border-slate-100">
                                            <p className="text-xs text-slate-500 mb-1">موضوع مکتوب اصلی:</p>
                                            <p className="text-xs text-slate-700 line-clamp-2">{originalLetter.subject}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* راهنما */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 overflow-hidden">
                                    <div className="flex items-start gap-2">
                                        <Info className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-emerald-800">
                                            <p className="font-medium mb-1">راهنمای پاسخ به مکتوب</p>
                                            <ul className="space-y-1 text-emerald-700">
                                                <li>• گیرنده به صورت خودکار از مکتوب اصلی تعیین شده</li>
                                                <li>• پس از ارسال، پاسخ به کارتابل گیرنده می‌رود</li>
                                                <li>• می‌توانید پاسخ را به صورت پیش‌نویس ذخیره کنید</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* دکمه‌های موبایل */}
                            <div className="md:hidden col-span-12 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex justify-between p-5">
                                <button type="submit" form="reply-form" disabled={processing}
                                    className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    {processing ? 'در حال ارسال...' : 'ارسال پاسخ'}
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
        </>
    );
}