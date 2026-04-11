// resources/js/pages/letters/create.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
    Save, X, Paperclip, Send, Trash2, 
    Plus, AlertCircle, ChevronDown, FileText 
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { create as LetterCreate } from '@/routes/letters';
import type { LetterCategory, User, Department, Position } from '@/types';

interface Props {
    type: 'incoming' | 'outgoing' | 'internal';
    categories: LetterCategory[];
    users: {
        id: number;
        name: string;
        position: string | null;
        department: string | null;
    }[];
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number }[];
    securityLevels: Record<string, string>;
    priorityLevels: Record<string, string>;
}

interface FormData {
    letter_type: string;
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
    is_draft: boolean;
    
    // sender
    sender_user_id: number | null;
    sender_department_id: number | null;
    sender_name: string;
    sender_position_name: string;
    
    // recipient
    recipient_user_id: number | null;
    recipient_department_id: number | null;
    recipient_name: string;
    recipient_position_name: string;
    
    // cc
    cc_recipients: number[];
    instruction: string;
}

export default function LettersCreate({ 
    type, categories, users, departments, positions, 
    securityLevels, priorityLevels 
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        letter_type: type,
        category_id: null,
        subject: '',
        summary: '',
        content: '',
        security_level: 'internal',
        priority: 'normal',
        date: new Date().toISOString().split('T')[0],
        due_date: null,
        response_deadline: null,
        sheet_count: 1,
        is_draft: true,
        
        sender_user_id: null,
        sender_department_id: null,
        sender_name: '',
        sender_position_name: '',
        
        recipient_user_id: null,
        recipient_department_id: null,
        recipient_name: '',
        recipient_position_name: '',
        
        cc_recipients: [],
        instruction: '',
    });

    const [selectedSenderUser, setSelectedSenderUser] = useState<number | null>(null);
    const [selectedRecipientUser, setSelectedRecipientUser] = useState<number | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);

    // پر کردن خودکار اطلاعات فرستنده با انتخاب کاربر
    useEffect(() => {
        if (selectedSenderUser) {
            const user = users.find(u => u.id === selectedSenderUser);

            if (user) {
                setData('sender_name', user.name);
                setData('sender_position_name', user.position || '');
                setData('sender_department_id', 
                    departments.find(d => d.name === user.department)?.id || null
                );
            }
        } else {
            setData('sender_name', '');
            setData('sender_position_name', '');
            setData('sender_department_id', null);
        }
    }, [selectedSenderUser]);

    // پر کردن خودکار اطلاعات گیرنده با انتخاب کاربر
    useEffect(() => {
        if (selectedRecipientUser) {
            const user = users.find(u => u.id === selectedRecipientUser);

            if (user) {
                setData('recipient_name', user.name);
                setData('recipient_position_name', user.position || '');
                setData('recipient_department_id', 
                    departments.find(d => d.name === user.department)?.id || null
                );
            }
        } else {
            setData('recipient_name', '');
            setData('recipient_position_name', '');
            setData('recipient_department_id', null);
        }
    }, [selectedRecipientUser]);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();
        setData('is_draft', isDraft);
        
        // در اینجا باید فایل‌ها را هم ارسال کنید
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
            }
        });
        attachments.forEach(file => {
            formData.append('attachments[]', file);
        });
        
        post(LetterCreate(), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                if (!isDraft) {
                    reset();
                    setAttachments([]);
                }
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

    const getTitle = () => {
        switch (type) {
            case 'incoming': return 'ثبت نامه وارده';
            case 'outgoing': return 'ایجاد نامه صادره';
            case 'internal': return 'ایجاد نامه داخلی';
            default: return 'نامه جدید';
        }
    };

    return (
        <>
            <Head title={getTitle()} />

            <div className="max-w-4xl mx-auto py-6">
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                اطلاعات نامه را وارد کنید
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                <Save className="ml-2 h-4 w-4" />
                                ذخیره پیش‌نویس
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                                <Send className="ml-2 h-4 w-4" />
                                ثبت و ارسال
                            </button>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        
                        {/* Basic Info */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پایه</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        دسته‌بندی <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category_id || ''}
                                        onChange={(e) => setData('category_id', parseInt(e.target.value) || null)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        اولویت <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(priorityLevels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سطح امنیتی <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.security_level}
                                        onChange={(e) => setData('security_level', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(securityLevels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        تاریخ نامه <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        موضوع <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="موضوع نامه را وارد کنید..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        خلاصه
                                    </label>
                                    <textarea
                                        value={data.summary}
                                        onChange={(e) => setData('summary', e.target.value)}
                                        rows={3}
                                        placeholder="خلاصه نامه..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sender Info */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات فرستنده</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        انتخاب کاربر
                                    </label>
                                    <select
                                        value={selectedSenderUser || ''}
                                        onChange={(e) => setSelectedSenderUser(parseInt(e.target.value) || null)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">انتخاب از کاربران...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} - {user.position || 'بدون سمت'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام فرستنده <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sender_name}
                                        onChange={(e) => setData('sender_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سمت فرستنده
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sender_position_name}
                                        onChange={(e) => setData('sender_position_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recipient Info */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات گیرنده</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        انتخاب کاربر
                                    </label>
                                    <select
                                        value={selectedRecipientUser || ''}
                                        onChange={(e) => setSelectedRecipientUser(parseInt(e.target.value) || null)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">انتخاب از کاربران...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} - {user.position || 'بدون سمت'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام گیرنده <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.recipient_name}
                                        onChange={(e) => setData('recipient_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سمت گیرنده
                                    </label>
                                    <input
                                        type="text"
                                        value={data.recipient_position_name}
                                        onChange={(e) => setData('recipient_position_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        مهلت پاسخ (اختیاری)
                                    </label>
                                    <input
                                        type="date"
                                        value={data.response_deadline || ''}
                                        onChange={(e) => setData('response_deadline', e.target.value || null)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">متن نامه</h2>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={12}
                                placeholder="متن نامه را وارد کنید..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-iransans"
                            />
                        </div>

                        {/* Attachments */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">پیوست‌ها</h2>
                            
                            {/* File Input */}
                            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                                <div className="text-center">
                                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">برای آپلود فایل کلیک کنید</p>
                                    <p classname="text-xs text-gray-400">PDF, DOC, DOCX, JPG, PNG (حداکثر 10MB)</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            
                            {/* Attachments List */}
                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Instruction */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">دستورالعمل (برای ارجاع)</h2>
                            <textarea
                                value={data.instruction}
                                onChange={(e) => setData('instruction', e.target.value)}
                                rows={3}
                                placeholder="در صورت نیاز، دستورالعمل‌های لازم برای گیرنده را وارد کنید..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}