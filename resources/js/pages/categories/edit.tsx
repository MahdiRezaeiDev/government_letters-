import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Save, X, Tag, Building2, FolderTree,
    AlignLeft, ArrowUpDown, CheckCircle, Palette
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import categories from '@/routes/categories';
import type { Organization, LetterCategory } from '@/types';

interface Props {
    category: LetterCategory;
    organizations: Organization[];
    parentCategories: LetterCategory[];
}

// ─── Preset colors ─────────────────────────────────────────────────────────

const COLOR_PRESETS = [
    '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
    '#ef4444', '#f97316', '#f59e0b', '#10b981',
    '#14b8a6', '#06b6d4', '#64748b', '#1e293b',
];

// ─── Main Component ────────────────────────────────────────────────────────

export default function CategoriesEdit({ category, organizations, parentCategories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        organization_id: category.organization_id,
        name: category.name,
        code: category.code || '',
        parent_id: category.parent_id?.toString() || '',
        description: category.description || '',
        color: category.color || '#3b82f6',
        sort_order: category.sort_order || 0,
        status: category.status,
    });

    const [availableParents, setAvailableParents] = useState(parentCategories);

    useEffect(() => {
        if (data.organization_id) {
            axios.get(categories.list().url, {
                params: { organization_id: data.organization_id }
            })
                .then((response) => {
                    // فیلتر کردن دسته‌بندی فعلی و زیرمجموعه‌هایش از لیست والد
                    const filtered = (response.data.categories as LetterCategory[]).filter(
                        cat => cat.id !== category.id
                    );
                    setAvailableParents(filtered);
                }).catch((e) => {
                    console.error(e);
                });
        }
    }, [data.organization_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(categories.update(category.id).url);
    };

    return (
        <>
            <Head title={`ویرایش دسته‌بندی ${category.name}`} />

            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form id="cat-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* ── Main form card ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Tag className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">ویرایش دسته‌بندی</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">ویرایش مشخصات دسته‌بندی "{category.name}"</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">

                                    <div className="border-t border-slate-100" />

                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>سازمان</FieldLabel>
                                            <SelectField
                                                icon={Building2}
                                                value={data.organization_id}
                                                onChange={v => setData('organization_id', v)}
                                                error={errors.organization_id}
                                            >
                                                {organizations.map(org => (
                                                    <option key={org.id} value={org.id}>{org.name}</option>
                                                ))}
                                            </SelectField>
                                        </div>
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
                                    </div>

                                    {/* Parent + Sort Order */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel>دسته‌بندی والد</FieldLabel>
                                            <SelectField
                                                icon={FolderTree}
                                                value={data.parent_id}
                                                onChange={v => setData('parent_id', v)}
                                                error={errors.parent_id}
                                            >
                                                <option value="">بدون والد (سطح اول)</option>
                                                {availableParents?.map(cat => (
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
                                                error={errors.sort_order}
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
                            <div className="flex gap-3 pb-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    {processing ? 'در حال ذخیره...' : 'بروزرسانی دسته‌بندی'}
                                    <Save className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(categories.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                >
                                    انصراف
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}