import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, Paperclip, Send, Trash2,
    AlertCircle, ChevronDown, FileText,
    Calendar, UserIcon, Building2, Briefcase, Shield,
    Flag, FolderTree, FileSignature, Clock, Users,
    Building, Globe, UserCheck, CheckCircle, ChevronRight,
    ArrowLeft, Hash
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
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

const typeConfig = {
    incoming: {
        label: 'ثبت نامه وارده',
        desc: 'نامه‌ای که از سازمان یا شخص دیگری دریافت کرده‌اید',
        accent: '#0ea5e9',
        accentLight: '#e0f2fe',
        badge: 'وارده',
    },
    outgoing: {
        label: 'ایجاد نامه صادره',
        desc: 'نامه‌ای که به سازمان یا شخص دیگری ارسال می‌کنید',
        accent: '#8b5cf6',
        accentLight: '#ede9fe',
        badge: 'صادره',
    },
    internal: {
        label: 'ایجاد نامه داخلی',
        desc: 'نامه‌ای که بین واحدهای داخلی سازمان رد و بدل می‌شود',
        accent: '#10b981',
        accentLight: '#d1fae5',
        badge: 'داخلی',
    },
};

const sections = [
    { id: 'basic', label: 'اطلاعات پایه', icon: FileSignature },
    { id: 'sender', label: 'فرستنده', icon: UserIcon },
    { id: 'recipient', label: 'گیرنده', icon: UserCheck },
    { id: 'content', label: 'متن نامه', icon: FileText },
    { id: 'attachments', label: 'پیوست‌ها', icon: Paperclip },
    { id: 'instruction', label: 'دستورالعمل', icon: AlertCircle },
];

// ─── Shared Field Components ───────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
    );
}

function SelectField({
    icon: Icon, value, onChange, onBlur, error, children, placeholder
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; children: React.ReactNode; placeholder?: string;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700`}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {children}
                </select>
                <ChevronDown className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
}

function InputField({
    icon: Icon, value, onChange, onBlur, error, placeholder, type = 'text'
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; placeholder?: string; type?: string;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`}
                />
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
}

function SectionCard({ id, title, subtitle, icon: Icon, iconColor, children }: {
    id: string; title: string; subtitle: string; icon: React.ElementType; iconColor: string; children: React.ReactNode;
}) {
    return (
        <div id={id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                <div className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4.5 w-4.5" style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800 leading-tight">{title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function LettersCreate({
    type, categories, users, departments, positions,
    externalOrganizations, externalOrganizationsTree,
    securityLevels, priorityLevels
}: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;
    const config = typeConfig[type];

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
    const [activeSection, setActiveSection] = useState('basic');
    const [recipientPositions, setRecipientPositions] = useState<{ id: number; name: string }[]>([]);
    const [externalDepartments, setExternalDepartments] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
    const [externalPositions, setExternalPositions] = useState<{ id: number; name: string }[]>([]);

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    // ── Effects (logic preserved) ─────────────────────────────────────────

    useEffect(() => {
        if (selectedRecipientDepartment) {
            setRecipientPositions(positions.filter(p => p.department_id === selectedRecipientDepartment));
        } else {
            setRecipientPositions([]);
        }
    }, [selectedRecipientDepartment, positions]);

    useEffect(() => {
        if (selectedExternalOrg && data.recipient_type === 'external') {
            router.get('/organizations/departments', { organization_id: selectedExternalOrg }, {
                preserveState: true,
                onSuccess: (page) => setExternalDepartments(page.props.departments as any[]),
            });
        } else {
            setExternalDepartments([]);
            setSelectedExternalDept(null);
            setExternalPositions([]);
        }
    }, [selectedExternalOrg, data.recipient_type]);

    useEffect(() => {
        if (selectedExternalDept && data.recipient_type === 'external') {
            router.get('/departments/positions', { department_id: selectedExternalDept }, {
                preserveState: true,
                onSuccess: (page) => setExternalPositions(page.props.positions as any[]),
            });
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
            if (org) setData('recipient_name', org.name);
        }
    }, [selectedExternalOrg, externalOrganizations]);

    useEffect(() => {
        if (selectedExternalDept && data.recipient_type === 'external') {
            const dept = externalDepartments.find(d => d.id === selectedExternalDept);
            if (dept) setData('recipient_position_name', dept.name);
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

    // Intersection observer for active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );
        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

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
        attachments.forEach(file => formData.append('attachments[]', file));
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
        if (e.target.files) setAttachments([...attachments, ...Array.from(e.target.files)]);
    };
    const removeAttachment = (index: number) => setAttachments(attachments.filter((_, i) => i !== index));

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

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <>
            <Head title={config.label} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                .sidebar-nav-item.active { background: ${config.accentLight}; color: ${config.accent}; font-weight: 600; }
                .sidebar-nav-item.active .nav-icon { color: ${config.accent}; }
                .sidebar-nav-item.active .nav-dot { background: ${config.accent}; }
                .accent-btn { background: ${config.accent}; }
                .accent-btn:hover { filter: brightness(0.92); }
                .accent-badge { background: ${config.accentLight}; color: ${config.accent}; }
                .radio-option input:checked + .radio-card {
                    border-color: ${config.accent};
                    background: ${config.accentLight};
                }
                input[type=file]::-webkit-file-upload-button { display: none; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">
                {/* ── Top Header Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Left: breadcrumb + badge */}
                            <div className="flex items-center gap-3">
                                <span className="accent-badge text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
                                    {config.badge}
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">{config.label}</h1>
                            </div>
                            {/* Right: actions */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    پیش‌نویس
                                </button>
                                <button
                                    type="submit"
                                    form="letter-form"
                                    disabled={processing}
                                    className="accent-btn flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing ? 'در حال ارسال...' : 'ثبت و ارسال'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="letter-form" onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="flex gap-8 items-start">

                            {/* ── Sticky Sidebar ── */}
                            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
                                {/* Letter type card */}
                                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 mb-4">
                                    <p className="text-xs text-slate-400 font-medium mb-1">نوع نامه</p>
                                    <p className="text-sm font-bold text-slate-800 leading-snug">{config.label}</p>
                                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{config.desc}</p>
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        {data.date}
                                    </div>
                                </div>

                                {/* Section navigation */}
                                <nav className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-50">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">بخش‌ها</p>
                                    </div>
                                    <ul className="py-2">
                                        {sections.map((s, i) => (
                                            <li key={s.id}>
                                                <a
                                                    href={`#${s.id}`}
                                                    onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                                                    className={`sidebar-nav-item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all duration-150 ${activeSection === s.id ? 'active' : ''}`}
                                                >
                                                    <span className="nav-dot w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                                                    <s.icon className="nav-icon h-4 w-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-xs">{s.label}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Attachment count badge */}
                                {attachments.length > 0 && (
                                    <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-indigo-500" />
                                        <span className="text-xs font-semibold text-indigo-700">{attachments.length} پیوست</span>
                                    </div>
                                )}
                            </aside>

                            {/* ── Main Content ── */}
                            <div className="flex-1 min-w-0 space-y-5">

                                {/* 1. Basic Info */}
                                <SectionCard id="basic" title="اطلاعات پایه" subtitle="مشخصات اصلی نامه" icon={FileSignature} iconColor="#6366f1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>دسته‌بندی</FieldLabel>
                                            <SelectField
                                                icon={FolderTree}
                                                value={data.category_id || ''}
                                                onChange={(v) => setData('category_id', parseInt(v) || null)}
                                                onBlur={() => handleBlur('category_id')}
                                                error={getFieldError('category_id')}
                                                placeholder="انتخاب کنید..."
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </SelectField>
                                        </div>
                                        <div>
                                            <FieldLabel required>تاریخ نامه</FieldLabel>
                                            <InputField
                                                icon={Calendar}
                                                type="date"
                                                value={data.date}
                                                onChange={(v) => setData('date', v)}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>اولویت</FieldLabel>
                                            <SelectField
                                                icon={Flag}
                                                value={data.priority}
                                                onChange={(v) => setData('priority', v)}
                                            >
                                                {Object.entries(priorityLevels).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </SelectField>
                                        </div>
                                        <div>
                                            <FieldLabel required>سطح امنیتی</FieldLabel>
                                            <SelectField
                                                icon={Shield}
                                                value={data.security_level}
                                                onChange={(v) => setData('security_level', v)}
                                            >
                                                {Object.entries(securityLevels).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </SelectField>
                                        </div>
                                        <div className="md:col-span-2">
                                            <FieldLabel required>موضوع</FieldLabel>
                                            <InputField
                                                value={data.subject}
                                                onChange={(v) => setData('subject', v)}
                                                onBlur={() => handleBlur('subject')}
                                                error={getFieldError('subject')}
                                                placeholder="موضوع نامه را وارد کنید..."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <FieldLabel>خلاصه</FieldLabel>
                                            <textarea
                                                value={data.summary}
                                                onChange={(e) => setData('summary', e.target.value)}
                                                rows={3}
                                                placeholder="خلاصه نامه..."
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none text-slate-700 placeholder-slate-300 hover:border-slate-300"
                                            />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* 2. Sender */}
                                <SectionCard id="sender" title="اطلاعات فرستنده" subtitle="شما به عنوان فرستنده ثبت می‌شوید" icon={UserIcon} iconColor="#10b981">
                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
                                                {currentUser.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 text-sm">{currentUser.full_name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    <Briefcase className="h-3 w-3 text-emerald-500" />
                                                    {currentUser.primary_position?.name || 'بدون سمت'}
                                                    <span className="text-slate-300">•</span>
                                                    <Building2 className="h-3 w-3 text-emerald-500" />
                                                    {currentUser.department?.name || 'بدون دپارتمان'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-white px-3 py-1.5 rounded-full border border-emerald-200 flex-shrink-0">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                تأیید شده
                                            </div>
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* 3. Recipient */}
                                <SectionCard id="recipient" title="اطلاعات گیرنده" subtitle="مشخصات فرد یا سازمان دریافت‌کننده" icon={data.recipient_type === 'internal' ? UserCheck : Globe} iconColor="#8b5cf6">
                                    {/* Type Toggle */}
                                    <div className="mb-6">
                                        <FieldLabel required>نوع گیرنده</FieldLabel>
                                        <div className="flex gap-3">
                                            {[
                                                { value: 'internal', label: 'داخلی', desc: 'کاربر سازمان', Icon: UserCheck },
                                                { value: 'external', label: 'خارجی', desc: 'سازمان دیگر', Icon: Globe },
                                            ].map(opt => (
                                                <label key={opt.value} className="radio-option flex-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={opt.value}
                                                        checked={data.recipient_type === opt.value}
                                                        onChange={(e) => setData('recipient_type', e.target.value as 'internal' | 'external')}
                                                        className="sr-only"
                                                    />
                                                    <div className={`radio-card flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all duration-200 ${data.recipient_type === opt.value ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                        <opt.Icon className={`h-4 w-4 flex-shrink-0 ${data.recipient_type === opt.value ? 'text-violet-600' : 'text-slate-400'}`} />
                                                        <div>
                                                            <p className={`text-sm font-semibold ${data.recipient_type === opt.value ? 'text-violet-700' : 'text-slate-700'}`}>{opt.label}</p>
                                                            <p className="text-xs text-slate-400">{opt.desc}</p>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Internal Recipient */}
                                    {data.recipient_type === 'internal' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="md:col-span-2">
                                                <FieldLabel required>کاربر</FieldLabel>
                                                <SelectField
                                                    icon={Users}
                                                    value={selectedRecipientUser || ''}
                                                    onChange={(v) => setSelectedRecipientUser(parseInt(v) || null)}
                                                    onBlur={() => handleBlur('recipient_user_id')}
                                                    error={getFieldError('recipient_user_id')}
                                                    placeholder="انتخاب کاربر..."
                                                >
                                                    {users.map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name} — {user.position || 'بدون سمت'}
                                                        </option>
                                                    ))}
                                                </SelectField>
                                            </div>
                                            <div>
                                                <FieldLabel>دپارتمان</FieldLabel>
                                                <SelectField
                                                    icon={Building2}
                                                    value={selectedRecipientDepartment || ''}
                                                    onChange={(v) => setSelectedRecipientDepartment(parseInt(v) || null)}
                                                    placeholder="انتخاب دپارتمان..."
                                                >
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>
                                            <div>
                                                <FieldLabel>سمت</FieldLabel>
                                                <SelectField
                                                    icon={Briefcase}
                                                    value={data.recipient_position_id || ''}
                                                    onChange={(v) => setData('recipient_position_id', parseInt(v) || null)}
                                                    placeholder="انتخاب سمت..."
                                                >
                                                    {recipientPositions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>
                                        </div>
                                    )}

                                    {/* External Recipient */}
                                    {data.recipient_type === 'external' && (
                                        <div className="space-y-5">
                                            <div>
                                                <FieldLabel required>سازمان</FieldLabel>
                                                <SelectField
                                                    icon={Building}
                                                    value={selectedExternalOrg || ''}
                                                    onChange={(v) => {
                                                        const orgId = parseInt(v) || null;
                                                        setSelectedExternalOrg(orgId);
                                                        setData('external_organization_id', orgId);
                                                        setSelectedExternalDept(null);
                                                        setData('external_department_id', null);
                                                        setData('external_position_id', null);
                                                    }}
                                                    placeholder="انتخاب سازمان..."
                                                >
                                                    {renderOrganizationTree(externalOrganizationsTree)}
                                                </SelectField>
                                            </div>
                                            {externalDepartments.length > 0 && (
                                                <div>
                                                    <FieldLabel>دپارتمان / ریاست</FieldLabel>
                                                    <SelectField
                                                        icon={Building2}
                                                        value={selectedExternalDept || ''}
                                                        onChange={(v) => {
                                                            const deptId = parseInt(v) || null;
                                                            setSelectedExternalDept(deptId);
                                                            setData('external_department_id', deptId);
                                                            setData('external_position_id', null);
                                                        }}
                                                        placeholder="انتخاب دپارتمان..."
                                                    >
                                                        {externalDepartments.map(dept => (
                                                            <option key={dept.id} value={dept.id}>
                                                                {'—'.repeat(dept.parent_id ? 1 : 0)} {dept.name}
                                                            </option>
                                                        ))}
                                                    </SelectField>
                                                </div>
                                            )}
                                            {externalPositions.length > 0 && (
                                                <div>
                                                    <FieldLabel>سمت</FieldLabel>
                                                    <SelectField
                                                        icon={Briefcase}
                                                        value={data.external_position_id || ''}
                                                        onChange={(v) => setData('external_position_id', parseInt(v) || null)}
                                                        placeholder="انتخاب سمت..."
                                                    >
                                                        {externalPositions.map(pos => (
                                                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                        ))}
                                                    </SelectField>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SectionCard>

                                {/* 4. Letter Content */}
                                <SectionCard id="content" title="متن نامه" subtitle="محتوای اصلی نامه را وارد کنید" icon={FileText} iconColor="#f59e0b">
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={14}
                                        placeholder="متن نامه را اینجا وارد کنید..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all resize-y text-slate-700 placeholder-slate-300 hover:border-slate-300 leading-7"
                                    />
                                    <p className="text-xs text-slate-400 mt-2 text-left">
                                        {data.content.length} حرف
                                    </p>
                                </SectionCard>

                                {/* 5. Attachments */}
                                <SectionCard id="attachments" title="پیوست‌ها" subtitle="فایل‌های ضمیمه نامه" icon={Paperclip} iconColor="#6366f1">
                                    <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200">
                                        <div className="text-center">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                                                <Paperclip className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">برای آپلود کلیک کنید</p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG (حداکثر ۱۰ مگابایت)</p>
                                        </div>
                                        <input type="file" multiple onChange={handleFileChange} className="hidden" />
                                    </label>

                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                                                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </SectionCard>

                                {/* 6. Instruction */}
                                <SectionCard id="instruction" title="دستورالعمل" subtitle="دستورالعمل‌های لازم برای گیرنده در صورت ارجاع" icon={AlertCircle} iconColor="#f97316">
                                    <textarea
                                        value={data.instruction}
                                        onChange={(e) => setData('instruction', e.target.value)}
                                        rows={4}
                                        placeholder="در صورت نیاز، دستورالعمل‌ها را اینجا وارد کنید..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all resize-none text-slate-700 placeholder-slate-300 hover:border-slate-300 leading-7"
                                    />
                                </SectionCard>

                                {/* Mobile Actions */}
                                <div className="flex gap-3 lg:hidden pb-4">
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e, true)}
                                        disabled={processing}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                    >
                                        <Save className="h-4 w-4" />
                                        پیش‌نویس
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="accent-btn flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                        {processing ? 'در حال ارسال...' : 'ثبت و ارسال'}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}