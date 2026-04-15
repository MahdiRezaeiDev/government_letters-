// resources/js/pages/letters/create.tsx

import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, Paperclip, Send, Trash2, AlertCircle,
    Calendar, UserIcon, Building2, Briefcase,
    Shield, Flag, FolderTree, Users, Building,
    Globe, Printer, ArrowLeft, CheckCircle2,
    FileText, Upload
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { store as LetterCreate } from '@/routes/letters';
import type { LetterCategory, Organization } from '@/types';

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

    recipient_type: 'internal' | 'external';
    recipient_user_id: number | null;
    recipient_department_id: number | null;
    recipient_position_id: number | null;
    recipient_name: string;
    recipient_position_name: string;

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
    const [isDragging, setIsDragging] = useState(false);

    const [recipientPositions, setRecipientPositions] = useState<{ id: number; name: string }[]>([]);
    const [externalDepartments, setExternalDepartments] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
    const [externalPositions, setExternalPositions] = useState<{ id: number; name: string }[]>([]);

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    // Effects
    useEffect(() => {
        if (selectedRecipientDepartment) {
            const deptPositions = positions.filter(p => p.department_id === selectedRecipientDepartment);
            setRecipientPositions(deptPositions);
        } else {
            setRecipientPositions([]);
        }
    }, [selectedRecipientDepartment, positions]);

    useEffect(() => {
        if (selectedExternalOrg && data.recipient_type === 'external') {
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

        formData.append('sender_user_id', String(currentUser.id));
        formData.append('sender_name', currentUser.full_name);
        formData.append('sender_position_name', currentUser.primary_position?.name || '');
        formData.append('sender_department_id', String(currentUser.department_id || ''));

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

        formData.append('cc_recipients', JSON.stringify(data.cc_recipients));
        formData.append('instruction', data.instruction);

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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            setAttachments([...attachments, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

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
            case 'incoming': return <AlertCircle className="h-5 w-5" />;
            case 'outgoing': return <Send className="h-5 w-5" />;
            case 'internal': return <FileText className="h-5 w-5" />;
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fa-IR');
    };

    return (
        <>
            <Head title={getTitle()} />

            <div className="min-h-screen bg-[#F5F7FA] py-8 px-4 sm:px-6 lg:px-8 font-sans">
                <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-5xl mx-auto">

                    {/* نوار ابزار بالا */}
                    <div className="flex items-center justify-between mb-6 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="ml-1 h-4 w-4" />
                            بازگشت
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
                            >
                                <Save className="ml-2 h-4 w-4" />
                                پیش‌نویس
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                <Printer className="ml-2 h-4 w-4" />
                                چاپ
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                <Send className="ml-2 h-4 w-4" />
                                {processing ? 'در حال ارسال...' : 'ثبت و ارسال'}
                            </button>
                        </div>
                    </div>

                    {/* برگه نامه */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 print:shadow-none print:border-0 print:rounded-none">

                        {/* هدر لوکس */}
                        <div className="relative px-10 pt-10 pb-6 border-b border-gray-100 print:border-black/20">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 print:hidden"></div>

                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Building className="h-4 w-4" />
                                        <span>جمهوری اسلامی ایران</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">وزارت امور خارجه</h2>
                                    <p className="text-sm text-gray-500 font-light">معاونت ارتباطات و فناوری اطلاعات</p>
                                </div>

                                <div className="text-left space-y-4">
                                    {/* برچسب نوع نامه */}
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                            {getTypeIcon()}
                                            <span className="mr-1.5">{getTitle()}</span>
                                        </span>
                                    </div>

                                    {/* شماره و تاریخ */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">شماره نامه</p>
                                            <p className="font-mono text-lg font-medium text-gray-700 tracking-wide">پیش‌نویس</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">تاریخ</p>
                                            <div className="relative group">
                                                <div className="flex items-center gap-1 text-gray-700">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        value={data.date}
                                                        onChange={(e) => setData('date', e.target.value)}
                                                        className="text-sm font-medium bg-transparent border-0 p-0 focus:ring-0 cursor-pointer w-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* محتوای اصلی */}
                        <div className="px-10 py-8 space-y-8">

                            {/* بخش گیرنده */}
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-12 lg:col-span-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <UserIcon className="h-3.5 w-3.5" />
                                            گیرنده
                                        </div>

                                        <div className="flex gap-6 text-sm border-b border-gray-100 pb-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="internal"
                                                    checked={data.recipient_type === 'internal'}
                                                    onChange={(e) => setData('recipient_type', e.target.value as 'internal')}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700">گیرنده داخلی</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="external"
                                                    checked={data.recipient_type === 'external'}
                                                    onChange={(e) => setData('recipient_type', e.target.value as 'external')}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700">سازمان خارجی</span>
                                            </label>
                                        </div>

                                        {data.recipient_type === 'internal' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <select
                                                    value={selectedRecipientUser || ''}
                                                    onChange={(e) => setSelectedRecipientUser(parseInt(e.target.value) || null)}
                                                    className="w-full px-0 py-2 text-sm border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent transition-colors"
                                                >
                                                    <option value="">انتخاب کاربر...</option>
                                                    {users.map(user => (
                                                        <option key={user.id} value={user.id}>{user.name}</option>
                                                    ))}
                                                </select>

                                                <select
                                                    value={selectedRecipientDepartment || ''}
                                                    onChange={(e) => setSelectedRecipientDepartment(parseInt(e.target.value) || null)}
                                                    className="w-full px-0 py-2 text-sm border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent transition-colors"
                                                >
                                                    <option value="">دپارتمان</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>

                                                <select
                                                    value={data.recipient_position_id || ''}
                                                    onChange={(e) => setData('recipient_position_id', parseInt(e.target.value) || null)}
                                                    className="w-full px-0 py-2 text-sm border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent transition-colors"
                                                >
                                                    <option value="">سمت</option>
                                                    {recipientPositions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <select
                                                    value={selectedExternalOrg || ''}
                                                    onChange={(e) => {
                                                        const orgId = parseInt(e.target.value) || null;
                                                        setSelectedExternalOrg(orgId);
                                                        setData('external_organization_id', orgId);
                                                    }}
                                                    className="w-full px-0 py-2 text-sm border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent transition-colors"
                                                >
                                                    <option value="">انتخاب سازمان...</option>
                                                    {renderOrganizationTree(externalOrganizationsTree)}
                                                </select>

                                                {externalDepartments.length > 0 && (
                                                    <select
                                                        value={selectedExternalDept || ''}
                                                        onChange={(e) => {
                                                            const deptId = parseInt(e.target.value) || null;
                                                            setSelectedExternalDept(deptId);
                                                            setData('external_department_id', deptId);
                                                        }}
                                                        className="w-full px-0 py-2 text-sm border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent transition-colors"
                                                    >
                                                        <option value="">انتخاب دپارتمان...</option>
                                                        {externalDepartments.map(dept => (
                                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                        ))}
                                                    </select>
                                                )}

                                                {externalPositions.length > 0 && (
                                                    <select
                                                        value={data.external_position_id || ''}
                                                        onChange={(e) => setData('external_position_id', parseInt(e.target.value) || null)}
                                                        className="w-full px-0 py-2 text-sm border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent transition-colors"
                                                    >
                                                        <option value="">انتخاب سمت...</option>
                                                        {externalPositions.map(pos => (
                                                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* متادیتای سریع - اولویت و سطح امنیتی به صورت Pill Toggle */}
                                <div className="col-span-12 lg:col-span-4 space-y-5">

                                    {/* بخش اولویت به صورت Pill Toggle */}
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            <Flag className="h-3.5 w-3.5" />
                                            اولویت نامه
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(priorityLevels).map(([key, label]) => {
                                                let activeClass = '';
                                                if (data.priority === key) {
                                                    if (key === 'normal') activeClass = 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
                                                    else if (key === 'urgent') activeClass = 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm';
                                                    else if (key === 'critical') activeClass = 'bg-red-50 text-red-700 border-red-300 shadow-sm';
                                                } else {
                                                    activeClass = 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50';
                                                }

                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setData('priority', key)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${activeClass}`}
                                                    >
                                                        {key === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* بخش سطح امنیتی به صورت Pill Toggle */}
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            <Shield className="h-3.5 w-3.5" />
                                            طبقه‌بندی امنیتی
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(securityLevels).map(([key, label]) => {
                                                let activeClass = '';
                                                if (data.security_level === key) {
                                                    if (key === 'internal') activeClass = 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
                                                    else if (key === 'confidential') activeClass = 'bg-purple-50 text-purple-700 border-purple-300 shadow-sm';
                                                    else if (key === 'secret') activeClass = 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm';
                                                    else if (key === 'top_secret') activeClass = 'bg-slate-800 text-white border-slate-800 shadow-sm';
                                                } else {
                                                    activeClass = 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50';
                                                }

                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setData('security_level', key)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${activeClass}`}
                                                    >
                                                        {key === 'top_secret' && <Shield className="h-3 w-3 fill-white" />}
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {data.security_level === 'top_secret' && (
                                            <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-2">
                                                <AlertCircle className="h-3 w-3" />
                                                این نامه جزو اسناد طبقه‌بندی شده است
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* موضوع */}
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    موضوع نامه
                                </div>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder="عنوان اصلی نامه را وارد کنید..."
                                    className={`w-full px-0 py-2 text-lg font-medium border-0 border-b-2 bg-transparent placeholder:text-gray-300 focus:ring-0 transition-colors ${getFieldError('subject')
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                />
                                {getFieldError('subject') && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* متن نامه */}
                            <div className="mt-8">
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={10}
                                    placeholder="متن نامه خود را اینجا بنویسید..."
                                    className="w-full px-0 py-2 text-gray-700 leading-8 border-0 focus:ring-0 bg-transparent resize-y placeholder:text-gray-300 text-justify"
                                    style={{ lineHeight: '2.2rem' }}
                                />
                            </div>

                            {/* بخش امضا و تایید */}
                            <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-100">
                                <div className="text-xs text-gray-400">
                                    <p>تعداد پیوست: {attachments.length} فایل</p>
                                </div>

                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-end gap-2 text-sm text-gray-600 mb-4">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>امضاء کننده: {currentUser.full_name}</span>
                                    </div>
                                    <div className="h-12 w-48 border-b-2 border-gray-300"></div>
                                    <p className="font-medium text-gray-800">{currentUser.full_name}</p>
                                    <p className="text-sm text-gray-500">{currentUser.primary_position?.name || 'کارشناس'}</p>
                                </div>
                            </div>
                        </div>

                        {/* فوتر - اطلاعات تکمیلی */}
                        <div className="px-10 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 print:bg-transparent">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <FolderTree className="h-3.5 w-3.5" />
                                    <span>دسته‌بندی:</span>
                                    <select
                                        value={data.category_id || ''}
                                        onChange={(e) => setData('category_id', parseInt(e.target.value) || null)}
                                        className="ml-1 px-1 py-0.5 border-0 border-b border-gray-300 bg-transparent text-xs focus:border-blue-500 focus:ring-0"
                                    >
                                        <option value="">بدون دسته</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>تاریخ ثبت: {formatDate(data.date)}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>شماره پیگیری: در انتظار ثبت</span>
                            </div>
                        </div>

                        {/* بخش آپلود پیوست */}
                        <div className="px-10 py-6 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
                                <Paperclip className="h-4 w-4" />
                                پیوست‌ها
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-6 transition-all text-center ${isDragging
                                    ? 'border-blue-400 bg-blue-50/50'
                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                                    }`}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="space-y-2">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                        <p className="text-sm text-gray-600">
                                            فایل‌ها را اینجا رها کنید یا <span className="text-blue-600 font-medium">انتخاب کنید</span>
                                        </p>
                                        <p className="text-xs text-gray-400">حداکثر حجم هر فایل 10 مگابایت</p>
                                    </div>
                                </label>
                            </div>

                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm group hover:border-gray-200 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* استایل‌های پرینت */}
            <style>{`
                @media print {
                    body { background: white; }
                    .bg-\\[\\#F5F7FA\\] { background: white; }
                    .shadow-xl { box-shadow: none; }
                    .border { border-color: #ddd !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { box-shadow: none; }
                    .print\\:border-0 { border: none; }
                    .print\\:bg-transparent { background: transparent !important; }
                    input, select, textarea { 
                        border: none !important; 
                        background: transparent !important;
                        -webkit-appearance: none;
                        appearance: none;
                        padding: 0 !important;
                        resize: none;
                    }
                    select { opacity: 1; }
                    button { display: none; }
                }
            `}</style>
        </>
    );
}