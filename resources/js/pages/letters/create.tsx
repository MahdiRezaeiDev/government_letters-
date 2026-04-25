import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Save, Paperclip, Send, Trash2,
    AlertCircle, ChevronDown, FileText,
    Calendar, UserIcon, Building2, Briefcase, Shield,
    Flag, FolderTree, FileSignature,
    Building, UserCheck, X, Eye, Download
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
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
    due_date: string | null;
    sheet_count: number;
    is_draft: boolean;
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

// داده‌های فیک برای تست
const FAKE_DATA = {
    internal: {
        category_id: 1,
        subject: 'درخواست بودجه تکمیلی پروژه سامانه جامع اداری',
        summary: 'با توجه به افزایش دامنه پروژه و نیاز به منابع بیشتر، درخواست تخصیص بودجه تکمیلی به مبلغ ۵۰۰ میلیون تومان جهت تکمیل فاز دوم سامانه جامع اداری را داریم.',
        content: `بسمه تعالی

احتراماً، همانطور که مستحضر هستید پروژه "سامانه جامع اداری" از ابتدای سال جاری با موفقیت آغاز شده و فاز اول آن طبق برنامه زمان‌بندی به اتمام رسیده است. با توجه به استقبال واحدهای سازمانی و نیاز به توسعه قابلیت‌های جدید، دامنه پروژه در فاز دوم گسترش یافته است.

بر اساس برآوردهای کارشناسی انجام شده توسط تیم فنی پروژه، جهت تکمیل فاز دوم و راه‌اندازی کامل سامانه، نیاز به تخصیص بودجه تکمیلی به مبلغ ۵,۰۰۰,۰۰۰,۰۰۰ ریال (پانصد میلیون تومان) می‌باشد.

جزئیات هزینه‌های پیش‌بینی شده به شرح پیوست تقدیم می‌گردد. خواهشمند است دستور فرمایید نسبت به بررسی و تخصیص بودجه مورد نظر اقدام لازم معمول گردد.

بدیهی است در صورت تخصیص به موقع بودجه، فاز دوم پروژه تا پایان آذرماه سال جاری به بهره‌برداری خواهد رسید.

با تجدید احترام`,
        security_level: 'confidential',
        priority: 'high',
        date: new Date().toLocaleDateString('fa-Af'),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-Af'),
        sheet_count: 3,
        recipient_type: 'internal' as const,
        instruction: 'با توجه به فوریت موضوع، خواهشمند است در اسرع وقت بررسی و اقدام لازم صورت پذیرد. نتیجه حداکثر تا پایان وقت اداری فردا به این دفتر اعلام گردد.',
    },
    external: {
        category_id: 2,
        subject: 'دعوتنامه شرکت در جلسه کمیته تخصصی امنیت سایبری',
        summary: 'بدینوسیله از جنابعالی دعوت می‌گردد در جلسه کمیته تخصصی امنیت سایبری که در تاریخ ۱۴۰۲/۰۹/۰۱ برگزار می‌گردد، حضور به هم رسانید.',
        content: `بسمه تعالی

جناب آقای/سرکار خانم ....................
معاون محترم ....................

سلام علیکم

احتراماً، بدینوسیله از جنابعالی دعوت می‌گردد در جلسه کمیته تخصصی امنیت سایبری که با حضور نمایندگان دستگاه‌های اجرایی استان برگزار می‌گردد، حضور به هم رسانید.

زمان: روز سه‌شنبه مورخ ۱۴۰۲/۰۹/۰۱ ساعت ۱۰:۰۰ صبح
مکان: سالن جلسات طبقه پنجم - ساختمان مرکزی

دستور جلسه:
۱- بررسی آخرین وضعیت تهدیدات سایبری استان
۲- ارائه گزارش اقدامات انجام شده در حوزه امنیت شبکه
۳- برنامه‌ریزی مانور امنیت سایبری پایان سال

خواهشمند است نماینده محترم خود را حداکثر تا تاریخ ۱۴۰۲/۰۸/۲۸ به این دبیرخانه معرفی فرمایید.

با تجدید احترام
دبیر کمیته تخصصی امنیت سایبری`,
        security_level: 'internal',
        priority: 'normal',
        date: new Date().toLocaleDateString('fa-Af'),
        due_date: null,
        sheet_count: 1,
        recipient_type: 'external' as const,
        instruction: 'پس از تایید نهایی، نامه با پست پیشتاز ارسال گردد.',
    }
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
    icon: Icon, value, onChange, error, children, placeholder
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    error?: string | null; children: React.ReactNode; placeholder?: string;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700`}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {children}
                </select>
                <ChevronDown className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}

function InputField({
    icon: Icon, value, onChange, error, placeholder, type = 'text'
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void;
    error?: string | null; placeholder?: string; type?: string;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`}
                />
            </div>
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
    categories, departments, positions,
    externalOrganizations = [],
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
        due_date: null,
        sheet_count: 1,
        is_draft: false,
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

    // State variables for UI
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [availablePositions, setAvailablePositions] = useState<{ id: number; name: string }[]>([]);

    const [selectedExternalOrg, setSelectedExternalOrg] = useState<number | null>(null);
    const [selectedExternalDept, setSelectedExternalDept] = useState<number | null>(null);
    const [externalDepartments, setExternalDepartments] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
    const [externalPositions, setExternalPositions] = useState<{ id: number; name: string }[]>([]);

    const [activeSection, setActiveSection] = useState('basic');
    const [fakeDataLoaded, setFakeDataLoaded] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    // 🎯 پر کردن خودکار فرم با داده‌های فیک در محیط development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && !fakeDataLoaded) {
            const useExternalData = false;
            const fakeData = useExternalData ? FAKE_DATA.external : FAKE_DATA.internal;

            const timer = setTimeout(() => {
                setData('category_id', fakeData.category_id);
                setData('subject', fakeData.subject);
                setData('summary', fakeData.summary);
                setData('content', fakeData.content);
                setData('security_level', fakeData.security_level);
                setData('priority', fakeData.priority);
                setData('date', fakeData.date);
                setData('due_date', fakeData.due_date);
                setData('sheet_count', fakeData.sheet_count);
                setData('recipient_type', fakeData.recipient_type);
                setData('instruction', fakeData.instruction);

                if (fakeData.recipient_type === 'internal') {
                    if (departments.length > 0) {
                        const firstDept = departments[0];
                        setSelectedDepartment(firstDept.id);
                        setData('recipient_department_id', firstDept.id);

                        setTimeout(() => {
                            const deptPositions = positions.filter(p => p.department_id === firstDept.id);

                            if (deptPositions.length > 0) {
                                const firstPos = deptPositions[0];
                                setData('recipient_position_id', firstPos.id);
                                setData('recipient_position_name', firstPos.name);
                                setData('recipient_name', `${firstPos.name} - ${firstDept.name}`);
                            }
                        }, 200);
                    }
                } else {
                    if (externalOrganizations.length > 0) {
                        const firstOrg = externalOrganizations[0];
                        setSelectedExternalOrg(firstOrg.id);
                        setData('external_organization_id', firstOrg.id);

                        setTimeout(() => {
                            axios.get('/organizations/departments', {
                                params: { organization_id: firstOrg.id }
                            }).then(response => {
                                const depts = response.data.departments;

                                if (depts && depts.length > 0) {
                                    setExternalDepartments(depts);
                                    const firstDept = depts[0];
                                    setSelectedExternalDept(firstDept.id);
                                    setData('external_department_id', firstDept.id);

                                    setTimeout(() => {
                                        axios.get('/departments/positions', {
                                            params: { department_id: firstDept.id }
                                        }).then(posResponse => {
                                            const posList = posResponse.data.positions;

                                            if (posList && posList.length > 0) {
                                                setExternalPositions(posList);
                                                const firstPos = posList[0];
                                                setData('external_position_id', firstPos.id);
                                                setData('recipient_position_name', firstPos.name);
                                                setData('recipient_name', `${firstOrg.name} - ${firstDept.name}`);
                                            }
                                        });
                                    }, 100);
                                }
                            });
                        }, 100);
                    }
                }

                setFakeDataLoaded(true);
                console.log('✅ فرم با داده‌های فیک پر شد (Development Mode)');
            }, 300);

            return () => clearTimeout(timer);
        }
    }, []);

    // بارگذاری پوزیشن‌ها هنگام انتخاب دپارتمان داخلی
    useEffect(() => {
        if (selectedDepartment) {
            const deptPositions = positions.filter(p => p.department_id === selectedDepartment);
            setAvailablePositions(deptPositions);
        } else {
            setAvailablePositions([]);
        }
    }, [selectedDepartment, positions]);

    // بارگذاری دپارتمان‌های سازمان خارجی
    useEffect(() => {
        if (selectedExternalOrg) {
            axios.get('/organizations/departments', {
                params: { organization_id: selectedExternalOrg }
            }).then(response => {
                setExternalDepartments(response.data.departments);
            }).catch(error => {
                console.error('خطا:', error);
                setExternalDepartments([]);
            });
        } else {
            setExternalDepartments([]);
            setSelectedExternalDept(null);
            setExternalPositions([]);
        }
    }, [selectedExternalOrg]);

    // بارگذاری پوزیشن‌های دپارتمان خارجی
    useEffect(() => {
        if (selectedExternalDept) {
            axios.get('/departments/positions', {
                params: { department_id: selectedExternalDept }
            }).then(response => {
                setExternalPositions(response.data.positions);
            }).catch(error => {
                console.error('خطا:', error);
                setExternalPositions([]);
            });
        } else {
            setExternalPositions([]);
        }
    }, [selectedExternalDept]);

    // تنظیم نام گیرنده خارجی
    useEffect(() => {
        if (selectedExternalOrg && selectedExternalDept && data.external_position_id) {
            const orgName = getOrganizationName(selectedExternalOrg);
            const deptName = getDepartmentName(selectedExternalDept);
            const positionName = externalPositions.find(p => p.id === data.external_position_id)?.name || '';
            setData('recipient_name', `${orgName} - ${deptName}`);
            setData('recipient_position_name', positionName);
        }
    }, [data.external_position_id, selectedExternalOrg, selectedExternalDept, externalPositions]);

    const getOrganizationName = (orgId: number): string => {
        const org = externalOrganizations.find(o => o.id === orgId);

        return org?.name || '';
    };

    const getDepartmentName = (deptId: number): string => {
        const dept = externalDepartments.find(d => d.id === deptId);

        return dept?.name || '';
    };

    // Intersection observer for active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );

        sections.forEach(s => {
            const el = document.getElementById(s.id);

            if (el) {
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, []);

    // ✅ اصلاح شده: تابع ارسال با استفاده از useForm
    const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();

        // تنظیم is_draft در دیتا
        setData('is_draft', isDraft);

        // ارسال مستقیم با useForm - اینرتزیا به صورت خودکار FormData می‌سازد
        post(LetterCreate(), {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Success:', page);

                if (!isDraft) {
                    reset();
                    // ریست کردن state های محلی
                    setSelectedDepartment(null);
                    setSelectedExternalOrg(null);
                    setSelectedExternalDept(null);
                    setAvailablePositions([]);
                    setExternalDepartments([]);
                    setExternalPositions([]);
                }
            },
            onError: (errors) => {
                console.error('Errors:', errors);
            },
        });
    };

    // ✅ توابع مدیریت فایل‌ها
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const currentAttachments = data.attachments || [];
            setData('attachments', [...currentAttachments, ...newFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        const currentAttachments = data.attachments || [];
        setData('attachments', currentAttachments.filter((_, i) => i !== index));
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

    const getFileIcon = (fileName: string): React.ElementType => {
        const ext = fileName.split('.').pop()?.toLowerCase();

        if (ext === 'pdf') {
            return FileText;
        }

        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
            return Eye;
        }

        return FileText;
    };

    return (
        <>
            <Head title="ثبت مکتوب صادره" />

            <div className="min-h-screen bg-slate-50/70" dir="rtl">
                {/* Header */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <h1 className="text-sm font-bold text-slate-800">ثبت مکتوب صادره</h1>
                                {(data.attachments && data.attachments.length > 0) && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {data.attachments.length} پیوست
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    پیش‌نویس
                                </button>
                                <button
                                    type="submit"
                                    form="letter-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                            {/* Sidebar */}
                            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
                                <nav className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-50">
                                        <p className="text-xs font-bold text-slate-400">بخش‌ها</p>
                                    </div>
                                    <ul className="py-2">
                                        {sections.map((s) => (
                                            <li key={s.id}>
                                                <a
                                                    href={`#${s.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${activeSection === s.id ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    <s.icon className="h-4 w-4" />
                                                    <span className="text-xs">{s.label}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </aside>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0 space-y-5">

                                {/* 1. Basic Info */}
                                <SectionCard id="basic" title="اطلاعات پایه" subtitle="مشخصات اصلی مکتوب" icon={FileSignature} iconColor="#6366f1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>دسته‌بندی</FieldLabel>
                                            <SelectField
                                                icon={FolderTree}
                                                value={data.category_id || ''}
                                                onChange={(v) => setData('category_id', parseInt(v) || null)}
                                                error={errors.category_id}
                                                placeholder="انتخاب کنید..."
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </SelectField>
                                            {errors.category_id && (
                                                <p className="text-rose-500 text-xs mt-1">{errors.category_id}</p>
                                            )}
                                        </div>
                                        <div>
                                            <PersianDatePicker
                                                label="تاریخ مکتوب"
                                                value={data.date}
                                                onChange={(date) => setData('date', date as string)}
                                            />
                                            {errors.date && (
                                                <p className="text-rose-500 text-xs mt-1">{errors.date}</p>
                                            )}                                        </div>
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
                                        <div>
                                            <FieldLabel>تاریخ سررسید</FieldLabel>
                                            <InputField
                                                icon={Calendar}
                                                type="date"
                                                value={data.due_date || ''}
                                                onChange={(v) => setData('due_date', v || null)}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>تعداد برگه</FieldLabel>
                                            <InputField
                                                type="number"
                                                value={String(data.sheet_count)}
                                                onChange={(v) => setData('sheet_count', parseInt(v) || 1)}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <FieldLabel required>موضوع</FieldLabel>
                                            <InputField
                                                value={data.subject}
                                                onChange={(v) => setData('subject', v)}
                                                error={errors.subject}
                                                placeholder="موضوع مکتوب را وارد کنید..."
                                            />
                                            {errors.subject && (
                                                <p className="text-rose-500 text-xs mt-1">{errors.subject}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <FieldLabel>خلاصه</FieldLabel>
                                            <textarea
                                                value={data.summary}
                                                onChange={(e) => setData('summary', e.target.value)}
                                                rows={3}
                                                placeholder="خلاصه مکتوب..."
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"
                                            />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* 2. Sender */}
                                <SectionCard id="sender" title="فرستنده" subtitle="شما به عنوان فرستنده ثبت می‌شوید" icon={UserIcon} iconColor="#10b981">
                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                                {currentUser.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{currentUser.full_name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {currentUser.primary_position?.name || 'بدون سمت'} • {currentUser.department?.name || 'بدون دپارتمان'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* 3. Recipient */}
                                <SectionCard id="recipient" title="گیرنده" subtitle="مشخصات گیرنده مکتوب" icon={UserCheck} iconColor="#8b5cf6">
                                    <div className="mb-6">
                                        <FieldLabel required>نوع گیرنده</FieldLabel>
                                        <div className="flex gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="internal"
                                                    checked={data.recipient_type === 'internal'}
                                                    onChange={(e) => {
                                                        setData('recipient_type', 'internal');
                                                        setSelectedExternalOrg(null);
                                                        setExternalDepartments([]);
                                                        setData('external_organization_id', null);
                                                        setData('external_department_id', null);
                                                        setData('external_position_id', null);
                                                    }}
                                                    className="sr-only"
                                                />
                                                <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${data.recipient_type === 'internal' ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                    <Building2 className="h-5 w-5 text-indigo-500" />
                                                    <div>
                                                        <p className="text-sm font-semibold">داخلی</p>
                                                        <p className="text-xs text-slate-400">دپارتمان‌های سازمان</p>
                                                    </div>
                                                </div>
                                            </label>
                                            <label className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="external"
                                                    checked={data.recipient_type === 'external'}
                                                    onChange={(e) => {
                                                        setData('recipient_type', 'external');
                                                        setSelectedDepartment(null);
                                                        setAvailablePositions([]);
                                                        setData('recipient_department_id', null);
                                                        setData('recipient_position_id', null);
                                                    }}
                                                    className="sr-only"
                                                />
                                                <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${data.recipient_type === 'external' ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                    <Building className="h-5 w-5 text-indigo-500" />
                                                    <div>
                                                        <p className="text-sm font-semibold">خارجی</p>
                                                        <p className="text-xs text-slate-400">وزارت‌خانه‌ها و سازمان‌ها</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* گیرنده داخلی */}
                                    {data.recipient_type === 'internal' && (
                                        <div className="space-y-4">
                                            <div>
                                                <FieldLabel required>ریاست / دپارتمان</FieldLabel>
                                                <SelectField
                                                    icon={Building2}
                                                    value={selectedDepartment || ''}
                                                    onChange={(v) => {
                                                        const deptId = parseInt(v) || null;
                                                        setSelectedDepartment(deptId);
                                                        setData('recipient_department_id', deptId);
                                                        setData('recipient_position_id', null);
                                                        setData('recipient_name', '');
                                                        setData('recipient_position_name', '');
                                                    }}
                                                    placeholder="انتخاب ریاست..."
                                                >
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>

                                            {selectedDepartment && (
                                                <div>
                                                    <FieldLabel required>سمت</FieldLabel>
                                                    <SelectField
                                                        icon={Briefcase}
                                                        value={data.recipient_position_id || ''}
                                                        onChange={(v) => {
                                                            const posId = parseInt(v) || null;
                                                            setData('recipient_position_id', posId);
                                                            const position = availablePositions.find(p => p.id === posId);
                                                            setData('recipient_position_name', position?.name || '');
                                                            setData('recipient_name', `${position?.name || ''} - ${departments.find(d => d.id === selectedDepartment)?.name || ''}`);
                                                        }}
                                                        placeholder="انتخاب سمت..."
                                                    >
                                                        <option value="">انتخاب سمت...</option>
                                                        {availablePositions.map(pos => (
                                                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                        ))}
                                                    </SelectField>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* گیرنده خارجی - FIXED VERSION */}
                                    {data.recipient_type === 'external' && (
                                        <div className="space-y-4">
                                            <div>
                                                <FieldLabel required>وزارت / سازمان</FieldLabel>
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
                                                        setData('recipient_name', '');
                                                        setData('recipient_position_name', '');
                                                    }}
                                                    placeholder="انتخاب سازمان..."
                                                >
                                                    <option value="">انتخاب سازمان...</option>
                                                    {externalOrganizations.map(org => (
                                                        <option key={org.id} value={org.id}>{org.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>

                                            {selectedExternalOrg && externalDepartments.length > 0 && (
                                                <div>
                                                    <FieldLabel required>ریاست / دپارتمان</FieldLabel>
                                                    <SelectField
                                                        icon={Building2}
                                                        value={selectedExternalDept || ''}
                                                        onChange={(v) => {
                                                            const deptId = parseInt(v) || null;
                                                            setSelectedExternalDept(deptId);
                                                            setData('external_department_id', deptId);
                                                            setData('external_position_id', null);
                                                            setData('recipient_position_name', '');
                                                        }}
                                                        placeholder="انتخاب ریاست..."
                                                    >
                                                        <option value="">انتخاب ریاست...</option>
                                                        {externalDepartments.map(dept => (
                                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                        ))}
                                                    </SelectField>
                                                </div>
                                            )}

                                            {selectedExternalDept && externalPositions.length > 0 && (
                                                <div>
                                                    <FieldLabel required>سمت</FieldLabel>
                                                    <SelectField
                                                        icon={Briefcase}
                                                        value={data.external_position_id || ''}
                                                        onChange={(v) => {
                                                            const posId = parseInt(v) || null;
                                                            setData('external_position_id', posId);
                                                            const position = externalPositions.find(p => p.id === posId);
                                                            setData('recipient_position_name', position?.name || '');
                                                        }}
                                                        placeholder="انتخاب سمت..."
                                                    >
                                                        <option value="">انتخاب سمت...</option>
                                                        {externalPositions.map(pos => (
                                                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                        ))}
                                                    </SelectField>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SectionCard>

                                {/* 4. Content */}
                                <SectionCard id="content" title="متن مکتوب" subtitle="محتوای اصلی مکتوب" icon={FileText} iconColor="#f59e0b">
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={14}
                                        placeholder="متن مکتوب را اینجا وارد کنید..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 resize-y"
                                    />
                                </SectionCard>

                                {/* 5. Attachments */}
                                <SectionCard id="attachments" title="پیوست‌ها" subtitle="فایل‌های ضمیمه" icon={Paperclip} iconColor="#6366f1">
                                    <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                                        <div className="text-center">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                                                <Paperclip className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">برای آپلود کلیک کنید</p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG (حداکثر ۱۰ مگابایت)</p>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                    </label>

                                    {data.attachments && data.attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-semibold text-slate-500">
                                                    {data.attachments.length} فایل انتخاب شده
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('attachments', [])}
                                                    className="text-xs text-rose-500 hover:text-rose-600"
                                                >
                                                    حذف همه
                                                </button>
                                            </div>
                                            {data.attachments.map((file, index) => {
                                                const FileIconComponent = getFileIcon(file.name);

                                                return (
                                                    <div key={index} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <FileIconComponent className="h-5 w-5 text-indigo-600" />
                                                            <div>
                                                                <span className="text-sm font-medium text-slate-700">{file.name}</span>
                                                                <span className="text-xs text-slate-400 mr-2">{formatFileSize(file.size)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewFile(file)}
                                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                title="پیش‌نمایش"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAttachment(index)}
                                                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                                title="حذف"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </SectionCard>

                                {/* 6. Instruction */}
                                <SectionCard id="instruction" title="دستورالعمل" subtitle="دستورالعمل‌های لازم" icon={AlertCircle} iconColor="#f97316">
                                    <textarea
                                        value={data.instruction}
                                        onChange={(e) => setData('instruction', e.target.value)}
                                        rows={4}
                                        placeholder="دستورالعمل‌ها را اینجا وارد کنید..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 resize-none"
                                    />
                                </SectionCard>

                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setPreviewFile(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800">پیش‌نمایش فایل</h3>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <p className="font-medium text-slate-800">{previewFile.name}</p>
                                    <p className="text-xs text-slate-400">{formatFileSize(previewFile.size)}</p>
                                </div>
                            </div>
                            {previewFile.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(previewFile)}
                                    alt={previewFile.name}
                                    className="max-w-full max-h-96 mx-auto rounded-lg"
                                />
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <FileText className="h-16 w-16 mx-auto mb-3 opacity-50" />
                                    <p>پیش‌نمایش برای این نوع فایل در دسترس نیست</p>
                                    <p className="text-xs mt-2">می‌توانید فایل را دانلود کنید</p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => {
                                    const url = URL.createObjectURL(previewFile);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = previewFile.name;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                دانلود فایل
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}