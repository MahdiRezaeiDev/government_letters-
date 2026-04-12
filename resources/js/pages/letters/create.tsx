import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
    Save, X, Paperclip, Send, Trash2, 
    Plus, AlertCircle, ChevronDown, FileText,
    Calendar, UserIcon, Building2, Briefcase, Shield,
    Flag, FolderTree, FileSignature, Clock, Users,
    CheckCircle, AlertTriangle
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { store as LetterCreate } from '@/routes/letters';
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
    
    sender_user_id: number | null;
    sender_department_id: number | null;
    sender_name: string;
    sender_position_name: string;
    
    recipient_user_id: number | null;
    recipient_department_id: number | null;
    recipient_name: string;
    recipient_position_name: string;
    
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
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    // Auto-fill sender info when user is selected
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

    // Auto-fill recipient info when user is selected
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

    const getTypeIcon = () => {
        switch (type) {
            case 'incoming': return <AlertCircle className="h-6 w-6" />;
            case 'outgoing': return <Send className="h-6 w-6" />;
            case 'internal': return <FileText className="h-6 w-6" />;
        }
    };

    const priorityConfig: Record<string, { label: string; color: string; bg: string; text: string }> = {
        low: { label: 'کم', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600' },
        normal: { label: 'معمولی', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700' },
        high: { label: 'بالا', color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700' },
        urgent: { label: 'فوری', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700' },
        very_urgent: { label: 'خیلی فوری', color: 'red', bg: 'bg-red-50', text: 'text-red-700' },
    };

    const securityConfig: Record<string, { label: string; color: string; bg: string; text: string }> = {
        public: { label: 'عمومی', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600' },
        internal: { label: 'داخلی', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700' },
        confidential: { label: 'محرمانه', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700' },
        secret: { label: 'سری', color: 'red', bg: 'bg-red-50', text: 'text-red-700' },
    };

    return (
        <>
            <Head title={getTitle()} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={(e) => handleSubmit(e, false)}>
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                            {getTypeIcon()}
                                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                اطلاعات نامه را در فرم زیر وارد کنید
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e, true)}
                                        disabled={processing}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        ذخیره پیش‌نویس
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ارسال...' : 'ثبت و ارسال'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
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
                                                دسته‌بندی <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <FolderTree className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.category_id || ''}
                                                    onChange={(e) => setData('category_id', parseInt(e.target.value) || null)}
                                                    onBlur={() => handleBlur('category_id')}
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${
                                                        getFieldError('category_id')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                                                    }`}
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            {getFieldError('category_id') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.category_id}
                                                </p>
                                            )}
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
                                                    {Object.entries(priorityLevels).map(([key, label]) => {
                                                        const config = priorityConfig[key];
                                                        return (
                                                            <option key={key} value={key}>
                                                                {label}
                                                            </option>
                                                        );
                                                    })}
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

                            {/* Sender Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات فرستنده</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">مشخصات فرد یا واحد ارسال‌کننده</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                انتخاب از کاربران
                                            </label>
                                            <div className="relative">
                                                <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={selectedSenderUser || ''}
                                                    onChange={(e) => setSelectedSenderUser(parseInt(e.target.value) || null)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">انتخاب از کاربران...</option>
                                                    {users.map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name} - {user.position || 'بدون سمت'}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام فرستنده <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.sender_name}
                                                onChange={(e) => setData('sender_name', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سمت فرستنده
                                            </label>
                                            <input
                                                type="text"
                                                value={data.sender_position_name}
                                                onChange={(e) => setData('sender_position_name', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات گیرنده</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">مشخصات فرد یا واحد دریافت‌کننده</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                انتخاب از کاربران
                                            </label>
                                            <div className="relative">
                                                <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={selectedRecipientUser || ''}
                                                    onChange={(e) => setSelectedRecipientUser(parseInt(e.target.value) || null)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">انتخاب از کاربران...</option>
                                                    {users.map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name} - {user.position || 'بدون سمت'}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام گیرنده <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.recipient_name}
                                                onChange={(e) => setData('recipient_name', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سمت گیرنده
                                            </label>
                                            <input
                                                type="text"
                                                value={data.recipient_position_name}
                                                onChange={(e) => setData('recipient_position_name', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                مهلت پاسخ
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={data.response_deadline || ''}
                                                    onChange={(e) => setData('response_deadline', e.target.value || null)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Letter Content Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
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
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-5 w-5 text-indigo-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">پیوست‌ها</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">فایل‌های ضمیمه نامه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
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
                                    
                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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

                            {/* Instruction Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">دستورالعمل</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">دستورالعمل‌های لازم برای گیرنده (در صورت ارجاع)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        value={data.instruction}
                                        onChange={(e) => setData('instruction', e.target.value)}
                                        rows={4}
                                        placeholder="در صورت نیاز، دستورالعمل‌های لازم برای گیرنده را وارد کنید..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Form Actions for Mobile */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:hidden">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    ذخیره پیش‌نویس
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'در حال ارسال...' : 'ثبت و ارسال'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}