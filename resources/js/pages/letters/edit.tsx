// resources/js/pages/letters/edit.tsx

import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
    Save, X, Paperclip, Send, Trash2, 
    AlertCircle, ChevronDown, FileText,
    Calendar, UserIcon, Building2, Briefcase, Shield,
    Flag, FolderTree, FileSignature, Clock, Users,
    Building, Globe, UserCheck, CheckCircle, ChevronRight,
    Download
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import letters, { update as LetterUpdate } from '@/routes/letters';
import type { LetterCategory, User, Department, Position, Organization, Letter, Attachment } from '@/types';

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
    letter, categories, 
    
    securityLevels, priorityLevels 
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
        sheet_count: letter.sheet_count,
    });

    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState(letter.attachments || []);
    const [deletedAttachments, setDeletedAttachments] = useState<number[]>([]);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    const handleSubmit = (e: React.FormEvent) => {
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



    return (
        <>
            <Head title={`ویرایش نامه - ${letter.subject}`} />

            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg text-white">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ویرایش نامه</h1>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {letter.letter_number} - {letter.tracking_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.get(letters.show({ letter: letter.id }))}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <FileSignature className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات پایه</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">مشخصات اصلی نامه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                دسته‌بندی
                                            </label>
                                            <div className="relative">
                                                <FolderTree className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.category_id || ''}
                                                    onChange={(e) => setData('category_id', parseInt(e.target.value) || null)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                اولویت <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Flag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.priority}
                                                    onChange={(e) => setData('priority', e.target.value)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    {Object.entries(priorityLevels).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سطح امنیتی <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.security_level}
                                                    onChange={(e) => setData('security_level', e.target.value)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    {Object.entries(securityLevels).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تاریخ نامه <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={data.date}
                                                    onChange={(e) => setData('date', e.target.value)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                موضوع <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                onBlur={() => handleBlur('subject')}
                                                placeholder="موضوع نامه را وارد کنید..."
                                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                    getFieldError('subject')
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                                                }`}
                                            />
                                            {getFieldError('subject') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.subject}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                خلاصه
                                            </label>
                                            <textarea
                                                value={data.summary}
                                                onChange={(e) => setData('summary', e.target.value)}
                                                rows={3}
                                                placeholder="خلاصه نامه..."
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sender Information (Read-only - Current User) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات فرستنده</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">شما به عنوان فرستنده نامه ثبت شده‌اید</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                                {currentUser.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{currentUser.full_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {currentUser.primary_position?.name || 'بدون سمت'} • 
                                                    {currentUser.department?.name || 'بدون دپارتمان'}
                                                </p>
                                            </div>
                                            <CheckCircle className="mr-auto h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Information (Read-only) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات گیرنده</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">گیرنده نامه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {letter.recipient_name?.charAt(0) || 'R'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{letter.recipient_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {letter.recipient_position_name || 'بدون سمت'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Letter Content Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">متن نامه</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">متن اصلی نامه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={12}
                                        placeholder="متن نامه را وارد کنید..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
                                    />
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-5 w-5 text-indigo-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">پیوست‌ها</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">فایل‌های ضمیمه نامه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {/* Existing Attachments */}
                                    {existingAttachments.length > 0 && (
                                        <div className="mb-4 space-y-2">
                                            <h3 className="text-sm font-medium text-gray-700">پیوست‌های فعلی</h3>
                                            {existingAttachments.map((attachment) => (
                                                <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-5 w-5 text-blue-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{attachment.file_name}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {(attachment.file_size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => downloadAttachment(attachment)}
                                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingAttachment(attachment.id)}
                                                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* New Attachments Upload */}
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                        <div className="text-center">
                                            <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">برای آپلود فایل کلیک کنید</p>
                                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG (حداکثر 10MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    
                                    {/* New Attachments List */}
                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <h3 className="text-sm font-medium text-gray-700">پیوست‌های جدید</h3>
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-5 w-5 text-blue-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {(file.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}