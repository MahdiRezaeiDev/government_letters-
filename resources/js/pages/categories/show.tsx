import { Head, router } from '@inertiajs/react';
import {
    Pencil, Trash2, ArrowRight, Tag, Building2, FolderTree,
    AlignLeft, ArrowUpDown, CheckCircle, Calendar, Hash
} from 'lucide-react';
import React, { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import categories from '@/routes/categories';
import type { LetterCategory, Organization } from '@/types';

interface Props {
    category: LetterCategory & {
        organization?: Organization;
        parent?: LetterCategory;
        children?: LetterCategory[];
        children_count?: number;
    };
}

export default function CategoriesShow({ category }: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(categories.destroy(category.id).url, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title={`جزئیات دسته‌بندی ${category.name}`} />

            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-5">
                        {/* ── Header Actions ── */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => router.get(categories.index())}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                <ArrowRight className="h-4 w-4" />
                                بازگشت به لیست
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.get(categories.edit(category.id).url)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all"
                                >
                                    <Pencil className="h-4 w-4" />
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                </button>
                            </div>
                        </div>

                        {/* ── Main Info Card ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: category.color + '22' }}>
                                    <Tag className="h-4 w-4" style={{ color: category.color }} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-800">{category.name}</h2>
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                                            style={{ backgroundColor: category.color + '22', color: category.color, border: `1px solid ${category.color}40` }}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ backgroundColor: category.color }} />
                                            {category.code || category.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">اطلاعات کامل دسته‌بندی</p>
                                </div>
                                {/* Status Badge */}
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${category.status
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${category.status ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    {category.status ? 'فعال' : 'غیرفعال'}
                                </span>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Organization */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 mb-0.5">سازمان</p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {category.organization?.name || 'تعیین نشده'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Parent Category */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                            <FolderTree className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 mb-0.5">دسته‌بندی والد</p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {category.parent ? (
                                                    <span
                                                        className="inline-flex items-center gap-1.5"
                                                        style={{ color: category.parent.color }}
                                                    >
                                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.parent.color }} />
                                                        {category.parent.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">سطح اول (بدون والد)</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Sort Order */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                            <ArrowUpDown className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 mb-0.5">ترتیب نمایش</p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {category.sort_order ?? 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Color */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: category.color + '22' }}>
                                            <div className="h-4 w-4 rounded" style={{ backgroundColor: category.color }} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 mb-0.5">رنگ</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-800 font-mono">
                                                    {category.color}
                                                </span>
                                                <span
                                                    className="h-5 w-5 rounded-md border border-slate-200"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Children Count */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                            <Hash className="h-4 w-4 text-teal-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 mb-0.5">تعداد زیرمجموعه‌ها</p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {category.children_count ?? category.children?.length ?? 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: category.status ? '#10b98122' : '#f1f5f9' }}>
                                            <CheckCircle
                                                className="h-4 w-4"
                                                style={{ color: category.status ? '#10b981' : '#94a3b8' }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 mb-0.5">وضعیت</p>
                                            <p className="text-sm font-semibold" style={{ color: category.status ? '#065f46' : '#64748b' }}>
                                                {category.status ? 'فعال' : 'غیرفعال'}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {category.status
                                                    ? 'در لیست‌ها نمایش داده می‌شود'
                                                    : 'از دید کاربران مخفی است'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {category.description && (
                                    <>
                                        <div className="border-t border-slate-100" />
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlignLeft className="h-4 w-4 text-slate-400" />
                                                <h3 className="text-sm font-bold text-slate-700">توضیحات</h3>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                                <p className="text-sm text-slate-600 leading-7 whitespace-pre-wrap">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Timestamps */}
                                <div className="border-t border-slate-100" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>تاریخ ایجاد: {new Date(category.created_at).toLocaleDateString('fa-IR')}</span>
                                    </div>
                                    {category.updated_at && (
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>آخرین بروزرسانی: {new Date(category.updated_at).toLocaleDateString('fa-IR')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Children Categories ── */}
                        {category.children && category.children.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <FolderTree className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            زیرمجموعه‌ها ({category.children.length})
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {category.children.map(child => (
                                            <button
                                                key={child.id}
                                                onClick={() => router.get(categories.show(child.id).url)}
                                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200 transition-all text-right group"
                                            >
                                                <div
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: (child.color || '#64748b') + '22' }}
                                                >
                                                    <Tag className="h-3.5 w-3.5" style={{ color: child.color || '#64748b' }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                                                        {child.name}
                                                    </p>
                                                    {child.code && (
                                                        <p className="text-xs text-slate-400 truncate">{child.code}</p>
                                                    )}
                                                </div>
                                                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Delete Confirmation Modal ── */}

            {showDeleteConfirm && (
                <DeleteConfirmationModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                    }}
                    onConfirm={handleDelete}
                    title="حذف دسته‌بندی"
                    message="آیا از حذف این دسته‌بندی اطمینان دارید؟"
                    itemName={category.name}
                    isLoading={processing}
                />
            )}
        </>
    );
}