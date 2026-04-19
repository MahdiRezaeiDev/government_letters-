import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Tag, Building2, Hash, FolderTree,
    AlignLeft, ArrowUpDown, CheckCircle, Palette
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import categories from '@/routes/categories';
import type { Organization, LetterCategory } from '@/types';

interface Props {
    organizations: Organization[];
    parentCategories: LetterCategory[];
}

// ─── Preset colors ─────────────────────────────────────────────────────────

const COLOR_PRESETS = [
    '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
    '#ef4444', '#f97316', '#f59e0b', '#10b981',
    '#14b8a6', '#06b6d4', '#64748b', '#1e293b',
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

function InputField({
    icon: Icon, value, onChange, placeholder, type = 'text', error
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    placeholder?: string; type?: string; error?: string | null;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100'
                }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`}
                />
            </div>
            {error && <p className="text-rose-500 text-xs mt-1.5">{error}</p>}
        </div>
    );
}

function SelectField({
    icon: Icon, value, onChange, children
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void; children: React.ReactNode;
}) {
    return (
        <div className="relative flex items-center rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all duration-200">
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
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function CategoriesCreate({ organizations, parentCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        organization_id: organizations[0]?.id || '',
        name: '',
        code: '',
        parent_id: '',
        description: '',
        color: '#3b82f6',
        sort_order: 0,
        status: true,
    });

    const [availableParents, setAvailableParents] = useState(parentCategories);

    useEffect(() => {
        if (data.organization_id) {
            router.get('/categories/list',
                { organization_id: data.organization_id },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setAvailableParents(page.props.categories as LetterCategory[]);
                    },
                }
            );
        }
    }, [data.organization_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(categories.store());
    };

    return (
        <>
            <Head title="ایجاد دسته‌بندی جدید" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
                input[type=color]::-webkit-color-swatch { border: none; border-radius: 8px; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 tracking-wide">
                                    دسته‌بندی‌ها
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد دسته‌بندی جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(categories.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="cat-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد دسته‌بندی'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="cat-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-teal-100 bg-gradient-to-l from-teal-50 to-cyan-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Tag className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد دسته‌بندی جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        دسته‌بندی‌ها برای سازمان‌دهی نامه‌ها بر اساس موضوع یا نوع استفاده می‌شوند.
                                    </p>
                                </div>
                            </div>

                            {/* ── Main form card ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <Tag className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات دسته‌بندی</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات اصلی دسته‌بندی نامه</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">

                                    {/* Organization */}
                                    <div>
                                        <FieldLabel required>سازمان</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.organization_id}
                                            onChange={v => setData('organization_id', v)}
                                        >
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </SelectField>
                                        {errors.organization_id && (
                                            <p className="text-rose-500 text-xs mt-1.5">{errors.organization_id}</p>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام دسته‌بندی</FieldLabel>
                                            <InputField
                                                icon={Tag}
                                                value={data.name}
                                                onChange={v => setData('name', v)}
                                                placeholder="مثال: اداری، مالی، پرسنلی"
                                                error={errors.name}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>کد دسته‌بندی</FieldLabel>
                                            <InputField
                                                icon={Hash}
                                                value={data.code}
                                                onChange={v => setData('code', v)}
                                                placeholder="مثال: CAT-001"
                                                error={errors.code}
                                            />
                                        </div>
                                    </div>

                                    {/* Parent + Sort Order */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel>دسته‌بندی والد</FieldLabel>
                                            <SelectField
                                                icon={FolderTree}
                                                value={data.parent_id}
                                                onChange={v => setData('parent_id', v)}
                                            >
                                                <option value="">بدون والد (سطح اول)</option>
                                                {availableParents.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </SelectField>
                                        </div>
                                        <div>
                                            <FieldLabel>ترتیب نمایش</FieldLabel>
                                            <InputField
                                                icon={ArrowUpDown}
                                                type="number"
                                                value={data.sort_order}
                                                onChange={v => setData('sort_order', parseInt(v) || 0)}
                                                placeholder="0"
                                            />
                                            <p className="text-xs text-slate-400 mt-1.5">اعداد کوچکتر زودتر نمایش داده می‌شوند</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Color picker */}
                                    <div>
                                        <FieldLabel>رنگ دسته‌بندی</FieldLabel>
                                        <div className="flex items-center gap-4">
                                            {/* Native color input styled as swatch */}
                                            <div className="relative flex-shrink-0">
                                                <input
                                                    type="color"
                                                    value={data.color}
                                                    onChange={e => setData('color', e.target.value)}
                                                    className="h-11 w-11 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-transparent"
                                                    title="انتخاب رنگ"
                                                />
                                            </div>
                                            {/* Hex input */}
                                            <div className="flex-1">
                                                <InputField
                                                    icon={Palette}
                                                    value={data.color}
                                                    onChange={v => setData('color', v)}
                                                    placeholder="#3b82f6"
                                                />
                                            </div>
                                        </div>

                                        {/* Preset swatches */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {COLOR_PRESETS.map(preset => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => setData('color', preset)}
                                                    title={preset}
                                                    className="h-7 w-7 rounded-lg border-2 transition-all duration-150 hover:scale-110 focus:outline-none"
                                                    style={{
                                                        backgroundColor: preset,
                                                        borderColor: data.color === preset ? '#1e293b' : 'transparent',
                                                        boxShadow: data.color === preset ? `0 0 0 2px #fff, 0 0 0 4px ${preset}` : 'none',
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Live preview badge */}
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs text-slate-400">پیش‌نمایش:</span>
                                            <span
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                                                style={{ backgroundColor: data.color + '22', color: data.color, border: `1px solid ${data.color}40` }}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
                                                {data.name || 'نام دسته‌بندی'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Description */}
                                    <div>
                                        <FieldLabel>توضیحات</FieldLabel>
                                        <div className={`relative flex items-start rounded-xl border bg-white transition-all duration-200 border-slate-200 hover:border-slate-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100`}>
                                            <AlignLeft className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />
                                            <textarea
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                rows={3}
                                                placeholder="توضیحات مربوط به این دسته‌بندی..."
                                                className="w-full pr-10 pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300 resize-none leading-7"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Status toggle */}
                                    <div>
                                        <FieldLabel>وضعیت</FieldLabel>
                                        <button
                                            type="button"
                                            onClick={() => setData('status', !data.status)}
                                            style={data.status ? { borderColor: '#6ee7b7', backgroundColor: '#d1fae5' } : {}}
                                            className={`w-full p-4 rounded-xl border-2 text-right transition-all duration-200 focus:outline-none ${data.status ? '' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: data.status ? '#10b98122' : '#f1f5f9' }}
                                                >
                                                    <CheckCircle
                                                        className="h-5 w-5"
                                                        style={{ color: data.status ? '#10b981' : '#94a3b8' }}
                                                    />
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <p className="text-sm font-bold" style={{ color: data.status ? '#065f46' : '#334155' }}>
                                                        {data.status ? 'فعال' : 'غیرفعال'}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {data.status
                                                            ? 'این دسته‌بندی در لیست انتخاب نمایش داده می‌شود'
                                                            : 'این دسته‌بندی پنهان خواهد بود'}
                                                    </p>
                                                </div>
                                                {/* Toggle pill */}
                                                <div
                                                    className="relative h-6 w-11 rounded-full transition-colors duration-200 flex-shrink-0"
                                                    style={{ backgroundColor: data.status ? '#10b981' : '#cbd5e1' }}
                                                >
                                                    <div
                                                        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200"
                                                        style={{ right: data.status ? '4px' : 'auto', left: data.status ? 'auto' : '4px' }}
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(categories.index())}
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
                                    {processing ? 'در حال ذخیره...' : 'ایجاد دسته‌بندی'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}