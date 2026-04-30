import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Save, Paperclip, Send, Trash2, FileText, Shield,
    UserCheck, Info, Loader2, PenLine, Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import TextEditor from '@/components/TextEditor';
import LetterRoute from '@/routes/letters';
import type { LetterCategory, Organization } from '@/types';

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
        user_id: number;
        user_name?: string;
    }[];
    externalOrganizations?: Organization[];
    securityLevels: Record<string, SecurityLevel>;
    priorityLevels: Record<string, PriorityLevel>;
}

export default function LettersCreate({
    categories,
    departments,
    positions,
    externalOrganizations = [],
    securityLevels,
    priorityLevels,
}: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: null,
        subject: 'مکنوب جدید',
        content: 'مکتوب تست جدید',
        security_level: 'internal',
        priority: 'normal',
        date: new Date().toLocaleDateString('fa-IR', { calendar: 'persian', year: 'numeric', month: '2-digit', day: '2-digit' }),
        attachments: [],
        is_draft: false,
        recipient_type: 'internal',
        recipient_organization_id: currentUser.organization_id,
        recipient_department_id: null,
        recipient_position_id: null,
        recipient_user_id: null,
        recipient_name: '',
        recipient_position_name: '',
    });

    const [availablePositions, setAvailablePositions] = useState<{
        id: number;
        name: string;
        user_id?: number;
        user_name?: string;
    }[]>([]);
    const [extDepartments, setExtDepartments] = useState<{ id: number; name: string }[]>([]);
    const [extPositions, setExtPositions] = useState<{ id: number; name: string }[]>([]);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [loadingExtDepts, setLoadingExtDepts] = useState(false);
    const [loadingExtPositions, setLoadingExtPositions] = useState(false);

    // فیلتر پست‌های داخلی بر اساس دپارتمان انتخابی
    useEffect(() => {
        if (data.recipient_department_id && data.recipient_type === 'internal') {
            setLoadingPositions(true);
            setAvailablePositions(positions.filter(p => p.department_id === data.recipient_department_id));
            setLoadingPositions(false);
        } else {
            setAvailablePositions([]);
        }
    }, [data.recipient_department_id, data.recipient_type, positions]);

    // دریافت دپارتمان‌های وزارت خارجی
    useEffect(() => {
        if (data.recipient_organization_id && data.recipient_type === 'external') {
            setLoadingExtDepts(true);
            axios.get('/organizations/departments', { params: { organization_id: data.recipient_organization_id } })
                .then(res => {
                    setExtDepartments(res.data.departments || []);
                    setLoadingExtDepts(false);
                })
                .catch(() => {
                    setExtDepartments([]);
                    setLoadingExtDepts(false);
                });
        }
    }, [data.recipient_organization_id, data.recipient_type]);

    // دریافت پست‌های دپارتمان خارجی
    useEffect(() => {
        if (data.recipient_department_id && data.recipient_type === 'external') {
            setLoadingExtPositions(true);
            axios.get('/departments/positions', { params: { department_id: data.recipient_department_id } })
                .then(res => {
                    setExtPositions(res.data.positions || []);
                    setLoadingExtPositions(false);
                })
                .catch(() => {
                    setExtPositions([]);
                    setLoadingExtPositions(false);
                });
        } else {
            setExtPositions([]);
        }
    }, [data.recipient_department_id, data.recipient_type]);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
        e.preventDefault();

        const submittedData = { ...data, is_draft: isDraft };
        post(LetterRoute.store().url, {
            data: submittedData,
            preserveScroll: true,
            onSuccess: () => {
                if (!isDraft) {
                    reset();
                    setAvailablePositions([]);
                    setExtDepartments([]);
                    setExtPositions([]);
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
            <Head title="ایجاد مکتوب جدید" />

            <div className="min-h-screen">

                {/* ─── Body ─── */}
                <div className="max-w-7xl mx-auto px-3 lg:px-6 py-6">
                    <form id="letter-form" onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="grid grid-cols-12 gap-5">

                            {/* ══ ستون اصلی ══ */}
                            <div className="col-span-12 lg:col-span-8 space-y-5">
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex gap-3 items-center">
                                    <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <Tag className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">ثبت مکتوب جدید</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">برای ثبت مکتوب جدید فورم ذیل را با دقت پرکنید.</p>
                                    </div>
                                </div>

                                {/* اطلاعات مکتوب */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <PenLine className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">اطلاعات مکتوب</h3>
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
                                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                            </div>
                                        </div>

                                        {/* متن مکتوب */}
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

                                <div className="hidden md:flex gap-5 col-span-12 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden p-5">
                                    <button type="submit" form="letter-form" disabled={processing}
                                        className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        {processing ? 'در حال ارسال...' : 'ثبت و ارسال '}
                                    </button>
                                    <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={processing}
                                        className="cursor-pointer px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                                        <Save className="h-4 w-4" /> پیش‌نویس
                                    </button>
                                </div>
                            </div>

                            {/* ══ ستون کناری ══ */}
                            <div className="col-span-12 lg:col-span-4 space-y-5">

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
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityLevels[data.priority]?.activeColor.split(' ').slice(0, 2).join(' ')
                                                    }`}>
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
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${securityLevels[data.security_level]?.color ?? 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {securityLevels[data.security_level]?.label ?? 'داخلی'}
                                                </span>
                                            </div>
                                            <select
                                                value={data.security_level}
                                                onChange={(e) => setData('security_level', e.target.value)}
                                                className={inputClass}
                                            >
                                                {Object.entries(securityLevels).map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* گیرنده */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-bold text-slate-700">گیرنده</h3>
                                    </div>
                                    <div className="p-5 space-y-4">

                                        {/* toggle داخلی / خارجی */}
                                        <div className="flex gap-2">
                                            {(['internal', 'external'] as const).map(type => (
                                                <button key={type} type="button"
                                                    onClick={() => {
                                                        setData('recipient_type', type);

                                                        if (type === 'internal') {
                                                            setData('recipient_organization_id', currentUser.organization_id);
                                                            setData('recipient_department_id', null);
                                                            setData('recipient_position_id', null);
                                                            setData('recipient_user_id', null);
                                                            setData('recipient_name', '');
                                                            setData('recipient_position_name', '');
                                                        } else {
                                                            setData('recipient_organization_id', null);
                                                            setData('recipient_department_id', null);
                                                            setData('recipient_position_id', null);
                                                            setData('recipient_user_id', null);
                                                            setData('recipient_name', '');
                                                            setData('recipient_position_name', '');
                                                        }
                                                    }}
                                                    className={`flex-1 py-2 text-xs font-medium rounded-md border transition
                                                        ${data.recipient_type === type
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
                                                    {type === 'internal' ? 'داخلی' : 'خارج وزارت'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* ── گیرنده داخلی ── */}
                                        {data.recipient_type === 'internal' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        ریاست <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={data.recipient_department_id || ''}
                                                        onChange={(e) => {
                                                            const id = parseInt(e.target.value) || null;
                                                            setData('recipient_department_id', id);
                                                            setData('recipient_position_id', null);
                                                            setData('recipient_position_name', '');
                                                            setData('recipient_user_id', null);
                                                            setData('recipient_name', '');
                                                        }}
                                                        className={inputClass}>
                                                        <option value="">انتخاب دپارتمان...</option>
                                                        {departments.map(d => (
                                                            <option key={d.id} value={d.id}>{d.name}</option>
                                                        ))}
                                                    </select>
                                                    {/* ✅ نمایش خطای recipient_department_id */}
                                                    {errors.recipient_department_id && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.recipient_department_id}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        سمت / عنوان <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.recipient_position_id || ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || null;
                                                                const position = availablePositions.find(p => p.id === id);

                                                                setData('recipient_position_id', id);
                                                                setData('recipient_position_name', position?.name || '');
                                                                setData('recipient_user_id', position?.user_id || null);
                                                                setData('recipient_name', position?.user_name || '');
                                                            }}
                                                            disabled={!data.recipient_department_id || loadingPositions}
                                                            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}>
                                                            <option value="">انتخاب سمت...</option>
                                                            {availablePositions.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        {loadingPositions && (
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* ✅ نمایش خطای recipient_position_id */}
                                                    {errors.recipient_position_id && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.recipient_position_id}</p>
                                                    )}
                                                </div>

                                                {/* نمایش خلاصه گیرنده داخلی */}
                                                {data.recipient_position_name && (
                                                    <div className="bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-800">
                                                        <p className="font-medium mb-1">گیرنده انتخاب شده:</p>
                                                        <p>سمت: {data.recipient_position_name}</p>
                                                        <p className="text-green-600 text-[10px] mt-1">
                                                            دپارتمان: {departments.find(d => d.id === data.recipient_department_id)?.name}
                                                        </p>
                                                        {data.recipient_name && (
                                                            <p className="text-green-700 text-[10px] font-medium">
                                                                نام: {data.recipient_name}
                                                            </p>
                                                        )}
                                                        {data.recipient_user_id && (
                                                            <p className="text-green-600 text-[10px]">
                                                                کد کاربری: {data.recipient_user_id}
                                                            </p>
                                                        )}
                                                        {!data.recipient_user_id && (
                                                            <p className="text-yellow-600 text-[10px] mt-1">
                                                                ⚠ کاربری به این سمت اختصاص داده نشده است
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── گیرنده خارجی ── */}
                                        {data.recipient_type === 'external' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        وزارت <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={data.recipient_organization_id || ''}
                                                        onChange={(e) => {
                                                            const id = parseInt(e.target.value) || null;
                                                            const org = externalOrganizations.find(o => o.id === id);

                                                            setData('recipient_organization_id', id);
                                                            setData('recipient_name', org?.name || '');
                                                            setData('recipient_department_id', null);
                                                            setData('recipient_position_id', null);
                                                            setData('recipient_position_name', '');
                                                            setExtDepartments([]);
                                                            setExtPositions([]);
                                                        }}
                                                        className={inputClass}>
                                                        <option value="">انتخاب وزارت...</option>
                                                        {externalOrganizations.map(o => (
                                                            <option key={o.id} value={o.id}>{o.name}</option>
                                                        ))}
                                                    </select>
                                                    {/* ✅ نمایش خطای recipient_name برای گیرنده خارجی */}
                                                    {errors.recipient_name && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.recipient_name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        ریاست
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.recipient_department_id || ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || null;
                                                                setData('recipient_department_id', id);
                                                                setData('recipient_position_id', null);
                                                                setData('recipient_position_name', '');
                                                                setExtPositions([]);
                                                            }}
                                                            disabled={!data.recipient_organization_id || loadingExtDepts}
                                                            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}>
                                                            <option value="">انتخاب دپارتمان...</option>
                                                            {extDepartments.map(d => (
                                                                <option key={d.id} value={d.id}>{d.name}</option>
                                                            ))}
                                                        </select>
                                                        {loadingExtDepts && (
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        سمت
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.recipient_position_id || ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || null;
                                                                const position = extPositions.find(p => p.id === id);

                                                                setData('recipient_position_id', id);
                                                                setData('recipient_user_id', position?.user_id || null);
                                                                setData('recipient_position_name', position?.name || '');
                                                            }}
                                                            disabled={!data.recipient_department_id || loadingExtPositions}
                                                            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}>
                                                            <option value="">انتخاب سمت...</option>
                                                            {extPositions.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        {loadingExtPositions && (
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* ✅ نمایش خطای recipient_position_name برای گیرنده خارجی */}
                                                    {errors.recipient_position_name && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.recipient_position_name}</p>
                                                    )}
                                                </div>

                                                {/* نمایش خلاصه گیرنده خارجی */}
                                                {data.recipient_organization_id && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800 space-y-1">
                                                        <p className="font-medium">گیرنده انتخاب شده:</p>
                                                        <p>وزارت: {data.recipient_name}</p>
                                                        {data.recipient_department_id && (
                                                            <p>دپارتمان: {extDepartments.find(d => d.id === data.recipient_department_id)?.name}</p>
                                                        )}
                                                        {data.recipient_position_name && (
                                                            <p>سمت: {data.recipient_position_name}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
                                            <span className="text-xs text-slate-500">اولویت:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityLevels[data.priority]?.activeColor.split(' ').slice(0, 2).join(' ')
                                                }`}>
                                                {priorityLevels[data.priority]?.label ?? 'معمولی'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">سطح امنیتی:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${securityLevels[data.security_level]?.activeColor ?? 'bg-blue-100 text-blue-700'
                                                }`}>
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
                                                {data.recipient_type === 'internal' ? 'داخلی' : 'خارج وزارت'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* راهنما */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-hidden">
                                    <div className="flex items-start gap-2">
                                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-blue-800">
                                            <p className="font-medium mb-1">راهنمای ثبت مکتوب</p>
                                            <ul className="space-y-1 text-blue-700">
                                                <li>• فیلدهای ستاره‌دار الزامی هستند</li>
                                                <li>• پس از ثبت، مکتوب به کارتابل گیرنده ارسال می‌شود</li>
                                                <li>• می‌توانید مکتوب را به صورت پیش‌نویس ذخیره کنید</li>
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
                                    {processing ? 'در حال ارسال...' : 'ثبت و ارسال '}
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