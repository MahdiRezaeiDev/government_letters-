import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, FolderOpen, Hash, MapPin, FileText,
    Layers, Building2, CheckCircle, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import type { Department } from '@/types';

interface Props {
    departments: Department[];
    parentArchives: { id: number; name: string }[];
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
    icon: Icon, value, onChange, placeholder, error, textarea = false, rows = 3
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void;
    placeholder?: string; error?: string | null; textarea?: boolean; rows?: number;
}) {
    const wrapClass = `relative flex items-start rounded-xl border bg-white transition-all duration-200 ${error
            ? 'border-rose-300 ring-1 ring-rose-300'
            : 'border-slate-200 hover:border-slate-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100'
        }`;
    const cls = `w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`;

    return (
        <div>
            <div className={wrapClass}>
                {Icon && <Icon className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />}
                {textarea
                    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${cls} resize-none leading-7 pt-3`} />
                    : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
                }
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
    icon: Icon, value, onChange, children, error
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    children: React.ReactNode; error?: string | null;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100'
                }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
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

export default function ArchivesCreate({ departments, parentArchives }: Props) {
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const { data, setData, post, processing, errors } = useForm({
        department_id: departments[0]?.id || '',
        name: '',
        code: '',
        parent_id: '',
        description: '',
        location: '',
        is_active: true,
    });

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('archives.store'));
    };

    const hasPreview = !!(data.name && data.code);

    return (
        <>
            <Head title="ایجاد بایگانی جدید" />

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
                    <div className="max-w-2xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 tracking-wide">
                                    بایگانی
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد بایگانی جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(route('archives.index'))}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="archive-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد بایگانی'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                    <form id="archive-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-teal-100 bg-gradient-to-l from-teal-50 to-cyan-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <FolderOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد بایگانی جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        اطلاعات بایگانی را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.
                                    </p>
                                </div>
                            </div>

                            {/* ── Main Form Card ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <FolderOpen className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات بایگانی</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات و محل نگهداری</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">

                                    {/* Department */}
                                    <div>
                                        <FieldLabel required>دپارتمان</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.department_id}
                                            onChange={v => setData('department_id', v)}
                                            error={getFieldError('department_id')}
                                        >
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </SelectField>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام بایگانی</FieldLabel>
                                            <InputField
                                                icon={FolderOpen}
                                                value={data.name}
                                                onChange={v => setData('name', v)}
                                                placeholder="مثال: بایگانی اصلی"
                                                error={getFieldError('name')}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>کد بایگانی</FieldLabel>
                                            <InputField
                                                icon={Hash}
                                                value={data.code}
                                                onChange={v => setData('code', v)}
                                                placeholder="مثال: ARCH-001"
                                                error={getFieldError('code')}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Parent archive */}
                                    <div>
                                        <FieldLabel>بایگانی والد</FieldLabel>
                                        <SelectField
                                            icon={Layers}
                                            value={data.parent_id}
                                            onChange={v => setData('parent_id', v)}
                                        >
                                            <option value="">بدون والد (سطح اول)</option>
                                            {parentArchives.map(archive => (
                                                <option key={archive.id} value={archive.id}>{archive.name}</option>
                                            ))}
                                        </SelectField>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <FieldLabel>موقعیت مکانی</FieldLabel>
                                        <InputField
                                            icon={MapPin}
                                            value={data.location}
                                            onChange={v => setData('location', v)}
                                            placeholder="مثال: قفسه ۱، طبقه ۲"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <FieldLabel>توضیحات</FieldLabel>
                                        <InputField
                                            icon={FileText}
                                            value={data.description}
                                            onChange={v => setData('description', v)}
                                            placeholder="توضیحات مربوط به بایگانی..."
                                            textarea
                                            rows={3}
                                        />
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Active toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        style={data.is_active ? {
                                            borderColor: '#5eead4',
                                            backgroundColor: '#f0fdfa',
                                        } : {}}
                                        className={`w-full p-4 rounded-xl border-2 text-right transition-all duration-200 focus:outline-none ${data.is_active ? '' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                                                style={{ backgroundColor: data.is_active ? '#ccfbf1' : '#f1f5f9' }}
                                            >
                                                <CheckCircle
                                                    className="h-5 w-5 transition-colors"
                                                    style={{ color: data.is_active ? '#0d9488' : '#94a3b8' }}
                                                />
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className="text-sm font-bold" style={{ color: data.is_active ? '#0f766e' : '#334155' }}>
                                                    {data.is_active ? 'بایگانی فعال است' : 'بایگانی غیرفعال است'}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {data.is_active ? 'قابل استفاده و در دسترس' : 'برای فعال‌سازی کلیک کنید'}
                                                </p>
                                            </div>
                                            {data.is_active && (
                                                <div className="h-5 w-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* ── Live Preview ── */}
                            {hasPreview && (
                                <div className="rounded-2xl bg-gradient-to-l from-teal-600 to-cyan-700 px-6 py-4 flex items-center gap-4 fade-up">
                                    <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                                        <FolderOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white/70 mb-1">پیش‌نمایش بایگانی</p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="text-sm font-bold text-white">{data.name}</span>
                                            <span className="text-white/40 text-xs">•</span>
                                            <span className="text-xs font-mono text-teal-200 bg-white/10 px-2 py-0.5 rounded-md">{data.code}</span>
                                            {data.location && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span className="text-xs text-white/70 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />{data.location}
                                                    </span>
                                                </>
                                            )}
                                            <span className="text-white/40 text-xs">•</span>
                                            <span
                                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor: data.is_active ? '#0d9488' : '#64748b',
                                                    color: '#fff',
                                                }}
                                            >
                                                {data.is_active ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </div>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-teal-200 flex-shrink-0" />
                                </div>
                            )}

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(route('archives.index'))}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد بایگانی'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}