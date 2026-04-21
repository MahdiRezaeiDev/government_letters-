import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Building2, ChevronDown, Layers, Hash,
    CheckCircle, AlertCircle, FolderTree, Sparkles
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import departments from '@/routes/departments';
import type { Organization, Department } from '@/types';

interface Props {
    organizations: Organization[];
    parentDepartments: Department[];
    selectedOrganization?: number;
}

// ─── Shared Field Components ───────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
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
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error
                ? 'border-rose-300 ring-1 ring-rose-300'
                : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
                }`}>
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
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />{error}
                </p>
            )}
        </div>
    );
}

function SelectField({
    icon: Icon, value, onChange, onBlur, error, children, disabled = false
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; children: React.ReactNode; disabled?: boolean;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' :
                error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
                }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700 ${disabled ? 'cursor-not-allowed' : ''}`}
                >
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

// ─── Main Component ────────────────────────────────────────────────────────

export default function DepartmentsCreate({ organizations, parentDepartments, selectedOrganization }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        organization_id: selectedOrganization || organizations[0]?.id || '',
        name: '',
        code: '',
        parent_id: '',
        status: 'active',
    });

    const [availableParentDepts, setAvailableParentDepts] = useState<Department[]>(parentDepartments);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [selectedOrgName, setSelectedOrgName] = useState('');
    const [loadingParents, setLoadingParents] = useState(false);

    useEffect(() => {
        if (data.organization_id) {
            const org = organizations.find(o => o.id === Number(data.organization_id));
            setSelectedOrgName(org?.name || '');
            setLoadingParents(true);
            fetch(`/departments-list?organization_id=${data.organization_id}`)
                .then(r => r.json())
                .then(d => { setAvailableParentDepts(d); setLoadingParents(false); })
                .catch(() => setLoadingParents(false));
        }
    }, [data.organization_id, organizations]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(departments.store(), { onSuccess: () => reset() });
    };

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    const statusOptions = [
        { value: 'active', label: 'فعال', desc: 'ریاست فعال و قابل استفاده است', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
        { value: 'inactive', label: 'غیرفعال', desc: 'ریاست غیرفعال و در دسترس نیست', icon: AlertCircle, color: '#94a3b8', bg: '#f1f5f9' },
    ];

    const selectedStatus = statusOptions.find(s => s.value === data.status)!;
    const StatusIcon = selectedStatus.icon;

    return (
        <>
            <Head title="ایجاد ریاست جدید" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.25s ease-out both; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                                    <Layers className="h-4 w-4 text-white" />
                                </div>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد ریاست جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(departments.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="dept-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد ریاست'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="dept-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro Card ── */}
                            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-50 to-violet-50 px-6 py-5 flex items-center gap-4 fade-up">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد ریاست جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5">اطلاعات ریاست را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.</p>
                                </div>
                            </div>

                            {/* ── Main Form Card ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                        <FolderTree className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات ریاست</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات اصلی و وضعیت ریاست</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* سازمان */}
                                    <div>
                                        <FieldLabel required>وزارت</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.organization_id}
                                            onChange={v => setData('organization_id', v)}
                                            onBlur={() => handleBlur('organization_id')}
                                            error={getFieldError('organization_id')}
                                        >
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </SelectField>
                                        {selectedOrgName && !getFieldError('organization_id') && (
                                            <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                                                <Building2 className="h-3 w-3" />
                                                ریاست برای: {selectedOrgName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* نام + کد */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام ریاست</FieldLabel>
                                            <InputField
                                                icon={FolderTree}
                                                value={data.name}
                                                onChange={v => setData('name', v)}
                                                onBlur={() => handleBlur('name')}
                                                error={getFieldError('name')}
                                                placeholder="مثال: اداره مالی"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>کد ریاست</FieldLabel>
                                            <InputField
                                                icon={Hash}
                                                value={data.code}
                                                onChange={v => setData('code', v)}
                                                onBlur={() => handleBlur('code')}
                                                error={getFieldError('code')}
                                                placeholder="مثال: FIN-001"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* ریاست والد */}
                                    <div>
                                        <FieldLabel>ریاست والد</FieldLabel>
                                        <div className="relative">
                                            <SelectField
                                                icon={Layers}
                                                value={data.parent_id}
                                                onChange={v => setData('parent_id', v)}
                                                disabled={loadingParents || availableParentDepts?.length === 0}
                                            >
                                                <option value="">بدون والد (سطح اول)</option>
                                                {availableParentDepts.map(dept => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name}{dept.code ? ` (${dept.code})` : ''}
                                                    </option>
                                                ))}
                                            </SelectField>
                                            {loadingParents && (
                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        {availableParentDepts.length === 0 && data.organization_id && !loadingParents && (
                                            <div className="mt-2.5 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                                                <span>هیچ ریاست والدی یافت نشد. این ریاست به عنوان سطح اول ایجاد می‌شود.</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* وضعیت */}
                                    <div>
                                        <FieldLabel required>وضعیت ریاست</FieldLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {statusOptions.map(opt => {
                                                const Icon = opt.icon;
                                                const isSelected = data.status === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setData('status', opt.value)}
                                                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-right ${isSelected
                                                            ? `border-${opt.value === 'active' ? 'emerald' : 'gray'}-500 bg-${opt.value === 'active' ? 'emerald' : 'gray'}-50`
                                                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? `bg-${opt.value === 'active' ? 'emerald' : 'gray'}-100` : 'bg-slate-100'}`}>
                                                                <Icon className={`h-5 w-5 ${isSelected ? `text-${opt.value === 'active' ? 'emerald' : 'gray'}-600` : 'text-slate-500'}`} />
                                                            </div>
                                                            <div className="flex-1 text-right">
                                                                <p className={`text-sm font-bold ${isSelected ? `text-${opt.value === 'active' ? 'emerald' : 'gray'}-700` : 'text-slate-700'}`}>
                                                                    {opt.label}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="h-5 w-5 rounded-full flex items-center justify-center bg-emerald-500">
                                                                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Live Preview ── */}
                            {data.name && data.code && selectedOrgName && (
                                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-600 to-violet-700 px-6 py-4 flex items-center gap-4 fade-up">
                                    <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                                        <Layers className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white/70 mb-1">پیش‌نمایش ریاست</p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="text-sm font-bold text-white">{data.name}</span>
                                            <span className="text-white/40 text-xs">•</span>
                                            <span className="text-xs font-mono text-indigo-200 bg-white/10 px-2 py-0.5 rounded-md">{data.code}</span>
                                            <span className="text-white/40 text-xs">•</span>
                                            <span className="text-xs text-white/70 flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />{selectedOrgName}
                                            </span>
                                            {data.parent_id && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span className="text-xs text-white/70 flex items-center gap-1">
                                                        <Layers className="h-3 w-3" />
                                                        {availableParentDepts.find(d => d.id === Number(data.parent_id))?.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedStatus.color }}>
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}