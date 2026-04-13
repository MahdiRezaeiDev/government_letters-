// resources/js/pages/letters/create.tsx

import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
    Save, Paperclip, Send, Trash2, 
    AlertCircle, ChevronDown, FileText,
    Calendar, UserIcon, Building2, Briefcase, Shield,
    Flag, FolderTree, FileSignature, Clock, Users,
    Building, Globe, UserCheck, CheckCircle, ChevronRight
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { store as LetterCreate } from '@/routes/letters';
import type { LetterCategory, User, Department, Position, Organization } from '@/types';

interface Props {
    type: 'incoming' | 'outgoing' | 'internal';
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
    
    // گیرنده
    recipient_type: 'internal' | 'external';
    recipient_user_id: number | null;
    recipient_department_id: number | null;
    recipient_position_id: number | null;
    recipient_name: string;
    recipient_position_name: string;
    
    // برای گیرنده خارجی
    external_organization_id: number | null;
    external_department_id: number | null;
    external_position_id: number | null;
    
    cc_recipients: number[];
    instruction: string;
}

export default function LettersCreate({ 
    type, categories, users, departments, positions, 
    externalOrganizations, externalOrganizationsTree,
    securityLevels, priorityLevels 
}: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;
    
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
        
        recipient_type: 'internal',
        recipient_user_id: null,
        recipient_department_id: null,
        recipient_position_id: null,
        recipient_name: '',
        recipient_position_name: '',
        
        external_organization_id: null,
        external_department_id: null,
        external_position_id: null,
        
        cc_recipients: [],
        instruction: '',
    });

    const [selectedRecipientUser, setSelectedRecipientUser] = useState<number | null>(null);
    const [selectedRecipientDepartment, setSelectedRecipientDepartment] = useState<number | null>(null);
    const [selectedExternalOrg, setSelectedExternalOrg] = useState<number | null>(null);
    const [selectedExternalDept, setSelectedExternalDept] = useState<number | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    
    // پست‌های دپارتمان انتخاب شده برای گیرنده داخلی
    const [recipientPositions, setRecipientPositions] = useState<{ id: number; name: string }[]>([]);
    
    // دپارتمان‌های سازمان خارجی انتخاب شده
    const [externalDepartments, setExternalDepartments] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
    
    // پست‌های دپارتمان خارجی انتخاب شده
    const [externalPositions, setExternalPositions] = useState<{ id: number; name: string }[]>([]);

    // پیدا کردن سازمان انتخاب شده با دپارتمان‌هایش
    const selectedExternalOrgData = externalOrganizationsTree.find(org => org.id === selectedExternalOrg);

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    // دریافت پست‌های دپارتمان انتخاب شده برای گیرنده داخلی
    useEffect(() => {
        if (selectedRecipientDepartment) {
            const deptPositions = positions.filter(p => p.department_id === selectedRecipientDepartment);
            setRecipientPositions(deptPositions);
        } else {
            setRecipientPositions([]);
        }
    }, [selectedRecipientDepartment, positions]);

    // دریافت دپارتمان‌های سازمان خارجی انتخاب شده
    useEffect(() => {
        if (selectedExternalOrg && data.recipient_type === 'external') {
            // دریافت دپارتمان‌های سازمان خارجی (از طریق API)
            router.get('/organizations/departments', 
                { organization_id: selectedExternalOrg },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setExternalDepartments(page.props.departments as any[]);
                    }
                }
            );
        } else {
            setExternalDepartments([]);
            setSelectedExternalDept(null);
            setExternalPositions([]);
        }
    }, [selectedExternalOrg, data.recipient_type]);

    // دریافت پست‌های دپارتمان خارجی انتخاب شده
    useEffect(() => {
        if (selectedExternalDept && data.recipient_type === 'external') {
            router.get('/departments/positions',
                { department_id: selectedExternalDept },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setExternalPositions(page.props.positions as any[]);
                    }
                }
            );
        } else {
            setExternalPositions([]);
        }
    }, [selectedExternalDept, data.recipient_type]);

    // پر کردن خودکار اطلاعات گیرنده داخلی هنگام انتخاب کاربر
    useEffect(() => {
        if (selectedRecipientUser && data.recipient_type === 'internal') {
            const user = users.find(u => u.id === selectedRecipientUser);
            if (user) {
                setData('recipient_name', user.name);
                setData('recipient_position_name', user.position || '');
                setData('recipient_department_id', user.department_id || null);
                setSelectedRecipientDepartment(user.department_id || null);
                setData('recipient_user_id', user.id);
            }
        } else if (data.recipient_type !== 'internal') {
            setData('recipient_user_id', null);
            setData('recipient_department_id', null);
            setData('recipient_position_id', null);
            setSelectedRecipientUser(null);
            setSelectedRecipientDepartment(null);
        }
    }, [selectedRecipientUser, data.recipient_type]);

    // پر کردن اطلاعات گیرنده خارجی هنگام انتخاب سازمان و دپارتمان
    useEffect(() => {
        if (selectedExternalOrg && data.recipient_type === 'external') {
            const org = externalOrganizations.find(o => o.id === selectedExternalOrg);
            if (org) {
                setData('recipient_name', org.name);
            }
        }
    }, [selectedExternalOrg, externalOrganizations]);

    useEffect(() => {
        if (selectedExternalDept && data.recipient_type === 'external') {
            const dept = externalDepartments.find(d => d.id === selectedExternalDept);
            if (dept) {
                setData('recipient_position_name', dept.name);
            }
        }
    }, [selectedExternalDept, externalDepartments]);

    // وقتی نوع گیرنده تغییر می‌کند، فیلدها را ریست کن
    useEffect(() => {
        setData('recipient_user_id', null);
        setData('recipient_department_id', null);
        setData('recipient_position_id', null);
        setData('recipient_name', '');
        setData('recipient_position_name', '');
        setData('external_organization_id', null);
        setData('external_department_id', null);
        setData('external_position_id', null);
        setSelectedRecipientUser(null);
        setSelectedRecipientDepartment(null);
        setSelectedExternalOrg(null);
        setSelectedExternalDept(null);
        setExternalDepartments([]);
        setExternalPositions([]);
    }, [data.recipient_type]);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();
        setData('is_draft', isDraft);
        
        const formData = new FormData();
        
        // اطلاعات پایه
        formData.append('letter_type', data.letter_type);
        formData.append('category_id', String(data.category_id || ''));
        formData.append('subject', data.subject);
        formData.append('summary', data.summary || '');
        formData.append('content', data.content || '');
        formData.append('security_level', data.security_level);
        formData.append('priority', data.priority);
        formData.append('date', data.date);
        formData.append('due_date', data.due_date || '');
        formData.append('response_deadline', data.response_deadline || '');
        formData.append('sheet_count', String(data.sheet_count));
        formData.append('is_draft', String(isDraft));
        
        // فرستنده (کاربر فعلی)
        formData.append('sender_user_id', String(currentUser.id));
        formData.append('sender_name', currentUser.full_name);
        formData.append('sender_position_name', currentUser.primary_position?.name || '');
        formData.append('sender_department_id', String(currentUser.department_id || ''));
        
        // گیرنده
        formData.append('recipient_type', data.recipient_type);
        
        if (data.recipient_type === 'internal') {
            formData.append('recipient_user_id', String(data.recipient_user_id || ''));
            formData.append('recipient_department_id', String(data.recipient_department_id || ''));
            formData.append('recipient_position_id', String(data.recipient_position_id || ''));
            formData.append('recipient_name', data.recipient_name);
            formData.append('recipient_position_name', data.recipient_position_name);
            formData.append('external_organization_id', '');
            formData.append('external_department_id', '');
            formData.append('external_position_id', '');
        } else {
            formData.append('recipient_user_id', '');
            formData.append('recipient_department_id', '');
            formData.append('recipient_position_id', '');
            formData.append('recipient_name', data.recipient_name);
            formData.append('recipient_position_name', data.recipient_position_name);
            formData.append('external_organization_id', String(data.external_organization_id || ''));
            formData.append('external_department_id', String(data.external_department_id || ''));
            formData.append('external_position_id', String(data.external_position_id || ''));
        }
        
        // رونوشت و دستورالعمل
        formData.append('cc_recipients', JSON.stringify(data.cc_recipients));
        formData.append('instruction', data.instruction);
        
        // پیوست‌ها
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
                    setSelectedRecipientUser(null);
                    setSelectedRecipientDepartment(null);
                    setSelectedExternalOrg(null);
                    setSelectedExternalDept(null);
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

    // رندر درختی سازمان‌های خارجی
    const renderOrganizationTree = (organizations: Organization[], level = 0) => {
        return organizations.map(org => (
            <React.Fragment key={org.id}>
                <option value={org.id} style={{ paddingRight: `${level * 20}px` }}>
                    {'—'.repeat(level)} {org.name}
                </option>
                {org.children && renderOrganizationTree(org.children, level + 1)}
            </React.Fragment>
        ));
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

    const getTypeDescription = () => {
        switch (type) {
            case 'incoming':
                return 'نامه‌ای که از سازمان/شخص دیگری دریافت کرده‌اید';
            case 'outgoing':
                return 'نامه‌ای که به سازمان/شخص دیگری ارسال می‌کنید';
            case 'internal':
                return 'نامه‌ای که بین واحدهای داخلی سازمان رد و بدل می‌شود';
            default: return '';
        }
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
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white">
                                            {getTypeIcon()}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
                                            <p className="text-sm text-gray-500 mt-0.5">{getTypeDescription()}</p>
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
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات فرستنده</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">شما به عنوان فرستنده نامه ثبت می‌شوید</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
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

                            {/* Recipient Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        {data.recipient_type === 'internal' ? (
                                            <UserCheck className="h-5 w-5 text-purple-600" />
                                        ) : (
                                            <Globe className="h-5 w-5 text-purple-600" />
                                        )}
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                اطلاعات گیرنده
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                مشخصات فرد یا سازمان دریافت‌کننده نامه
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {/* نوع گیرنده */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            نوع گیرنده <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="internal"
                                                    checked={data.recipient_type === 'internal'}
                                                    onChange={(e) => setData('recipient_type', e.target.value as 'internal')}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">داخلی (کاربر سازمان)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="external"
                                                    checked={data.recipient_type === 'external'}
                                                    onChange={(e) => setData('recipient_type', e.target.value as 'external')}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">خارجی (سازمان دیگر)</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* گیرنده داخلی */}
                                    {data.recipient_type === 'internal' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    انتخاب از کاربران <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <select
                                                        value={selectedRecipientUser || ''}
                                                        onChange={(e) => setSelectedRecipientUser(parseInt(e.target.value) || null)}
                                                        onBlur={() => handleBlur('recipient_user_id')}
                                                        className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${
                                                            getFieldError('recipient_user_id')
                                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                    >
                                                        <option value="">انتخاب کاربر...</option>
                                                        {users.map(user => (
                                                            <option key={user.id} value={user.id}>
                                                                {user.name} - {user.position || 'بدون سمت'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                                {getFieldError('recipient_user_id') && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.recipient_user_id}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    دپارتمان
                                                </label>
                                                <div className="relative">
                                                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <select
                                                        value={selectedRecipientDepartment || ''}
                                                        onChange={(e) => setSelectedRecipientDepartment(parseInt(e.target.value) || null)}
                                                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                    >
                                                        <option value="">انتخاب دپارتمان...</option>
                                                        {departments.map(dept => (
                                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    سمت
                                                </label>
                                                <div className="relative">
                                                    <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <select
                                                        value={data.recipient_position_id || ''}
                                                        onChange={(e) => setData('recipient_position_id', parseInt(e.target.value) || null)}
                                                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                    >
                                                        <option value="">انتخاب سمت...</option>
                                                        {recipientPositions.map(pos => (
                                                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* گیرنده خارجی */}
                                    {data.recipient_type === 'external' && (
                                        <div className="grid grid-cols-1 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    سازمان <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <select
                                                        value={selectedExternalOrg || ''}
                                                        onChange={(e) => {
                                                            const orgId = parseInt(e.target.value) || null;
                                                            setSelectedExternalOrg(orgId);
                                                            setData('external_organization_id', orgId);
                                                            setSelectedExternalDept(null);
                                                            setData('external_department_id', null);
                                                            setData('external_position_id', null);
                                                        }}
                                                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                    >
                                                        <option value="">انتخاب سازمان...</option>
                                                        {renderOrganizationTree(externalOrganizationsTree)}
                                                    </select>
                                                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            
                                            {externalDepartments.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        دپارتمان/ریاست
                                                    </label>
                                                    <div className="relative">
                                                        <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <select
                                                            value={selectedExternalDept || ''}
                                                            onChange={(e) => {
                                                                const deptId = parseInt(e.target.value) || null;
                                                                setSelectedExternalDept(deptId);
                                                                setData('external_department_id', deptId);
                                                                setData('external_position_id', null);
                                                            }}
                                                            className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                        >
                                                            <option value="">انتخاب دپارتمان...</option>
                                                            {externalDepartments.map(dept => (
                                                                <option key={dept.id} value={dept.id}>
                                                                    {'—'.repeat(dept.parent_id ? 1 : 0)} {dept.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {externalPositions.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        سمت
                                                    </label>
                                                    <div className="relative">
                                                        <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <select
                                                            value={data.external_position_id || ''}
                                                            onChange={(e) => setData('external_position_id', parseInt(e.target.value) || null)}
                                                            className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                        >
                                                            <option value="">انتخاب سمت...</option>
                                                            {externalPositions.map(pos => (
                                                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
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