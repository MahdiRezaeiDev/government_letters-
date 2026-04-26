import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Briefcase, Layers, Hash, Award, FileText,
    AlertCircle, CheckCircle, TrendingUp, Shield, Star,
    Zap, Crown, Users, Building2, Info
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import positions from '@/routes/positions';
import type { Department } from '@/types';

interface Props {
    departments: Department[];
    selectedDepartment?: number;
}

// ─── Level config ──────────────────────────────────────────────────────────

const LEVELS = [
    { min: 0, max: 0, label: 'پایه', icon: Users, color: '#94a3b8', bg: '#f1f5f9' },
    { min: 1, max: 1, label: 'کارشناس', icon: Shield, color: '#3b82f6', bg: '#eff6ff' },
    { min: 2, max: 2, label: 'کارشناس ارشد', icon: Star, color: '#10b981', bg: '#ecfdf5' },
    { min: 3, max: 3, label: 'مدیر', icon: Crown, color: '#f59e0b', bg: '#fffbeb' },
    { min: 4, max: 4, label: 'مدیر ارشد', icon: Zap, color: '#f97316', bg: '#fff7ed' },
    { min: 5, max: 99, label: 'سطح بالا', icon: TrendingUp, color: '#8b5cf6', bg: '#f5f3ff' },
];

function getLevelInfo(level: number) {
    return LEVELS.find(l => level >= l.min && level <= l.max) ?? LEVELS[0];
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
    icon: Icon, value, onChange, onBlur, error, placeholder, type = 'text',
    min, max, textarea = false, rows = 4
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; placeholder?: string; type?: string;
    min?: number; max?: number; textarea?: boolean; rows?: number;
}) {
    const wrapClass = `relative flex items-start rounded-xl border bg-white transition-all duration-200 ${error
            ? 'border-rose-300 ring-1 ring-rose-300'
            : 'border-slate-200 hover:border-slate-300 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100'
        }`;
    const inputClass = `w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`;

    return (
        <div>
            <div className={wrapClass}>
                {Icon && <Icon className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />}
                {textarea ? (
                    <textarea
                        value={value as string}
                        onChange={e => onChange(e.target.value)}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        rows={rows}
                        className={`${inputClass} resize-none leading-7 pt-3`}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        className={inputClass}
                    />
                )}
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
    icon: Icon, value, onChange, onBlur, error, children
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; children: React.ReactNode;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100'
                }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700`}
                >
                    {children}
                </select>
                <svg className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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

export default function PositionsCreate({ departments, selectedDepartment }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        department_id: selectedDepartment || departments[0]?.id || '',
        name: '',
        code: '',
        level: 0,
        is_management: false,
        description: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [selectedDeptName, setSelectedDeptName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(positions.store(), { onSuccess: () => reset() });
    };

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    useEffect(() => {
        const dept = departments.find(d => d.id === Number(data.department_id));
        setSelectedDeptName(dept?.name || '');
    }, [data.department_id, departments]);

    const levelInfo = getLevelInfo(data.level);
    const LevelIcon = levelInfo.icon;
    const hasPreview = !!(data.name && data.code);

    return (
        <>
            <Head title="ایجاد وظیفه جدید" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.25s ease-out both; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 tracking-wide">
                                    وظایف
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد وظیفه جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="pos-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد وظیفه'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="pos-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50 to-purple-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد وظیفه جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        اطلاعات وظیفه را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.
                                    </p>
                                </div>
                            </div>

                            {/* ── Main Form Card ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                        <Info className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات پایه</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات اصلی وظیفه </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">

                                    {/* Department */}
                                    <div>
                                        <FieldLabel required>ریاست</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.department_id}
                                            onChange={v => setData('department_id', v)}
                                            onBlur={() => handleBlur('department_id')}
                                            error={getFieldError('department_id')}
                                        >
                                            <option value="">انتخاب ریاست...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </SelectField>
                                        {selectedDeptName && !getFieldError('department_id') && (
                                            <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
                                                <Layers className="h-3 w-3" />
                                                وظیفه برای: {selectedDeptName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام وظیفه</FieldLabel>
                                            <InputField
                                                icon={Briefcase}
                                                value={data.name}
                                                onChange={v => setData('name', v)}
                                                onBlur={() => handleBlur('name')}
                                                error={getFieldError('name')}
                                                placeholder="مثال: مدیر مالی"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>کد وظیفه</FieldLabel>
                                            <InputField
                                                icon={Hash}
                                                value={data.code}
                                                onChange={v => setData('code', v)}
                                                onBlur={() => handleBlur('code')}
                                                error={getFieldError('code')}
                                                placeholder="مثال: FIN-MGR-001"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Level + Management Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Level number input with live badge */}
                                        <div>
                                            <FieldLabel>سطح وظیفه</FieldLabel>
                                            <InputField
                                                icon={TrendingUp}
                                                type="number"
                                                value={data.level}
                                                onChange={v => setData('level', parseInt(v) || 0)}
                                                min={0}
                                                max={10}
                                                placeholder="0"
                                            />
                                            {/* Live level badge */}
                                            <div className="mt-2.5 flex items-center gap-2">
                                                <div
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300"
                                                    style={{
                                                        backgroundColor: levelInfo.bg,
                                                        color: levelInfo.color,
                                                        borderColor: levelInfo.color + '40',
                                                    }}
                                                >
                                                    <LevelIcon className="h-3 w-3" />
                                                    {levelInfo.label}
                                                </div>
                                                <span className="text-xs text-slate-400">هرچه عدد بزرگتر، سطح بالاتر (۰–۱۰)</span>
                                            </div>
                                        </div>

                                        {/* Management toggle card */}
                                        <div>
                                            <FieldLabel>نوع وظیفه</FieldLabel>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    {
                                                        value: false,
                                                        icon: Users,
                                                        title: 'عملیاتی',
                                                        desc: 'اجرای وظایف روزمره',
                                                    },
                                                    {
                                                        value: true,
                                                        icon: Crown,
                                                        title: 'مدیریتی',
                                                        desc: 'تصمیم‌گیری و سرپرستی',
                                                    },
                                                ].map(opt => {
                                                    const Icon = opt.icon;
                                                    const active = data.is_management === opt.value;
                                                    return (
                                                        <button
                                                            key={String(opt.value)}
                                                            type="button"
                                                            onClick={() => setData('is_management', opt.value)}
                                                            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-150 focus:outline-none ${active
                                                                    ? opt.value
                                                                        ? 'border-amber-400 bg-amber-50 shadow-sm'
                                                                        : 'border-slate-800 bg-slate-50 shadow-sm'
                                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {/* آیکون */}
                                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${active
                                                                    ? opt.value ? 'bg-amber-100' : 'bg-slate-200'
                                                                    : 'bg-slate-100'
                                                                }`}>
                                                                <Icon className={`h-5 w-5 transition-colors ${active
                                                                        ? opt.value ? 'text-amber-600' : 'text-slate-700'
                                                                        : 'text-slate-400'
                                                                    }`} />
                                                            </div>

                                                            {/* متن */}
                                                            <div>
                                                                <p className={`text-sm font-bold ${active
                                                                        ? opt.value ? 'text-amber-800' : 'text-slate-800'
                                                                        : 'text-slate-500'
                                                                    }`}>
                                                                    {opt.title}
                                                                </p>
                                                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                                                    {opt.desc}
                                                                </p>
                                                            </div>

                                                            {/* نشانگر انتخاب */}
                                                            {active && (
                                                                <span className={`absolute top-2.5 left-2.5 h-2 w-2 rounded-full ${opt.value ? 'bg-amber-400' : 'bg-slate-800'
                                                                    }`} />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Description */}
                                    <div>
                                        <FieldLabel>توضیحات</FieldLabel>
                                        <InputField
                                            icon={FileText}
                                            value={data.description}
                                            onChange={v => setData('description', v)}
                                            placeholder="شرح وظایف، مسئولیت‌ها و اختیارات این وظیفه..."
                                            textarea
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Live Preview strip ── */}
                            {hasPreview && (
                                <div className="rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-600 to-purple-700 px-6 py-4 flex items-center gap-4 fade-up">
                                    <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white/70 mb-1">پیش‌نمایش وظیفه</p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="text-sm font-bold text-white">{data.name}</span>
                                            <span className="text-white/40 text-xs">•</span>
                                            <span className="text-xs font-mono text-violet-200 bg-white/10 px-2 py-0.5 rounded-md">{data.code}</span>
                                            {data.level > 0 && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span
                                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ backgroundColor: levelInfo.color + '33', color: '#fff' }}
                                                    >
                                                        {levelInfo.label}
                                                    </span>
                                                </>
                                            )}
                                            {data.is_management && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                                                        <Crown className="h-3 w-3" />مدیریتی
                                                    </span>
                                                </>
                                            )}
                                            {selectedDeptName && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span className="text-xs text-white/70 flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />{selectedDeptName}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                                </div>
                            )}

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد وظیفه'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}