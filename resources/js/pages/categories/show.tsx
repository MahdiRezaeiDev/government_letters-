import { Head, Link, router } from '@inertiajs/react';
import {
    FolderTree, ArrowRight, Edit2, Trash2,
    FileText, Hash, CheckCircle, XCircle,
    ChevronRight, Tag, Layers, Calendar,
    LetterText, Inbox, Send, ArrowLeftRight
} from 'lucide-react';
import React, { useState } from 'react';
import categories from '@/routes/categories';
import lettersRoute from '@/routes/letters';
import type { LetterCategory } from '@/types';

interface Letter {
    id: number;
    subject: string;
    letter_number: string;
    date: string;
    final_status: string;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    priority: string;
}

interface Props {
    category: LetterCategory & {
        description?: string;
        code?: string;
        is_active: boolean;
        parent?: LetterCategory | null;
        children?: LetterCategory[];
        letters?: Letter[];
        letters_count?: number;
        created_at: string;
        updated_at: string;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}

// ─── Config ────────────────────────────────────────────────────────────────

const LETTER_TYPE_CONFIG = {
    incoming: { label: 'وارده', color: '#0ea5e9', bg: '#eff6ff', icon: Inbox },
    outgoing: { label: 'صادره', color: '#8b5cf6', bg: '#f5f3ff', icon: Send },
    internal: { label: 'داخلی', color: '#10b981', bg: '#ecfdf5', icon: ArrowLeftRight },
} as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'پیش‌نویس', color: '#64748b', bg: '#f1f5f9' },
    pending: { label: 'در انتظار', color: '#b45309', bg: '#fef3c7' },
    approved: { label: 'تأیید شده', color: '#15803d', bg: '#dcfce7' },
    rejected: { label: 'رد شده', color: '#b91c1c', bg: '#fee2e2' },
    archived: { label: 'بایگانی شده', color: '#475569', bg: '#f8fafc' },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, iconColor, title, subtitle, children, action }: {
    icon: React.ElementType; iconColor: string; title: string; subtitle?: string;
    children: React.ReactNode; action?: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {action}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-28 flex-shrink-0 pt-0.5">{label}</span>
            <div className="flex-1 text-sm text-slate-800">{children}</div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function CategoriesShow({ category, can }: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(categories.destroy(category.id), {
            onSuccess: () => router.get(categories.index()),
        });
    };

    const letters = category.letters ?? [];
    const children = category.children ?? [];

    return (
        <>
            <Head title={`دسته‌بندی: ${category.name}`} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.22s ease-out both; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 gap-4">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 min-w-0">
                                <Link href={categories.index()}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition">
                                    دسته‌بندی‌ها
                                </Link>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                                <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{category.name}</span>
                            </div>

                            {/* Status + Actions */}
                            <div className="flex items-center gap-2.5 flex-shrink-0">
                                <span
                                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                                    style={{
                                        backgroundColor: category.is_active ? '#dcfce7' : '#f1f5f9',
                                        color: category.is_active ? '#15803d' : '#64748b',
                                    }}
                                >
                                    {category.is_active
                                        ? <><CheckCircle className="h-3 w-3" />فعال</>
                                        : <><XCircle className="h-3 w-3" />غیرفعال</>
                                    }
                                </span>

                                {can.edit && (
                                    <Link
                                        href={categories.edit(category.id)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        <span className="hidden sm:inline">ویرایش</span>
                                    </Link>
                                )}

                                {can.delete && (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="hidden sm:inline">حذف</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-5">

                        {/* ── Hero identity card ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up">
                            <div className="h-1.5 w-full"
                                style={{ backgroundColor: category.is_active ? '#10b981' : '#94a3b8' }} />
                            <div className="px-6 py-6 flex items-start gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600
                                    flex items-center justify-center shadow-md flex-shrink-0">
                                    <FolderTree className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-xl font-black text-slate-900">{category.name}</h1>
                                        {category.code && (
                                            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold
                                                px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                                                <Hash className="h-3 w-3" />{category.code}
                                            </span>
                                        )}
                                    </div>
                                    {category.description && (
                                        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
                                            {category.description}
                                        </p>
                                    )}

                                    {/* Quick stats */}
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                            text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                            <LetterText className="h-3.5 w-3.5 text-slate-400" />
                                            {category.letters_count ?? letters.length} نامه
                                        </span>
                                        {children.length > 0 && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                                text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                                <Layers className="h-3.5 w-3.5 text-slate-400" />
                                                {children.length} زیردسته
                                            </span>
                                        )}
                                        {category.parent && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                                text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                                                <FolderTree className="h-3.5 w-3.5 text-indigo-400" />
                                                زیر: {category.parent.name}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                            text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(category.created_at).toLocaleDateString('fa-IR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                            {/* ── Left column: details ── */}
                            <div className="lg:col-span-1 space-y-5">

                                {/* Details */}
                                <SectionCard icon={Tag} iconColor="#6366f1" title="جزئیات" subtitle="مشخصات دسته‌بندی">
                                    <div>
                                        <MetaRow label="نام">
                                            <span className="font-bold">{category.name}</span>
                                        </MetaRow>
                                        {category.code && (
                                            <MetaRow label="کد">
                                                <span className="font-mono font-bold text-indigo-600">{category.code}</span>
                                            </MetaRow>
                                        )}
                                        <MetaRow label="وضعیت">
                                            <span
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: category.is_active ? '#dcfce7' : '#f1f5f9',
                                                    color: category.is_active ? '#15803d' : '#64748b',
                                                }}
                                            >
                                                {category.is_active
                                                    ? <><CheckCircle className="h-3 w-3" />فعال</>
                                                    : <><XCircle className="h-3 w-3" />غیرفعال</>}
                                            </span>
                                        </MetaRow>
                                        {category.parent && (
                                            <MetaRow label="دسته والد">
                                                <Link
                                                    href={categories.show(category.parent.id)}
                                                    className="text-indigo-600 hover:underline font-semibold text-sm"
                                                >
                                                    {category.parent.name}
                                                </Link>
                                            </MetaRow>
                                        )}
                                        <MetaRow label="ایجاد">
                                            {new Date(category.created_at).toLocaleDateString('fa-IR', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </MetaRow>
                                        <MetaRow label="ویرایش">
                                            {new Date(category.updated_at).toLocaleDateString('fa-IR', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </MetaRow>
                                    </div>
                                </SectionCard>

                                {/* Sub-categories */}
                                {children.length > 0 && (
                                    <SectionCard
                                        icon={Layers} iconColor="#8b5cf6"
                                        title="زیردسته‌ها"
                                        subtitle={`${children.length} دسته`}
                                    >
                                        <div className="space-y-2">
                                            {children.map(child => (
                                                <Link
                                                    key={child.id}
                                                    href={categories.show(child.id)}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50
                                                        border border-transparent hover:border-violet-100 transition-all group"
                                                >
                                                    <div className="h-7 w-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                        <FolderTree className="h-3.5 w-3.5 text-violet-600" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700 flex-1 truncate">
                                                        {child.name}
                                                    </span>
                                                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-violet-400 flex-shrink-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    </SectionCard>
                                )}
                            </div>

                            {/* ── Right column: letters ── */}
                            <div className="lg:col-span-2">
                                <SectionCard
                                    icon={FileText} iconColor="#f59e0b"
                                    title="نامه‌های این دسته‌بندی"
                                    subtitle={`${category.letters_count ?? letters.length} نامه`}
                                    action={
                                        letters.length > 0 ? (
                                            <Link
                                                href={lettersRoute.index({ query: { category_id: category.id } })}
                                                className="text-xs font-bold text-amber-600 hover:text-amber-700 px-3 py-1.5
                                                    rounded-lg hover:bg-amber-50 transition flex items-center gap-1"
                                            >
                                                مشاهده همه
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        ) : undefined
                                    }
                                >
                                    {letters.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                <FileText className="h-7 w-7 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">نامه‌ای در این دسته‌بندی وجود ندارد</p>
                                            <p className="text-xs text-slate-400 mt-1">نامه‌های ثبت‌شده در این دسته اینجا نمایش داده می‌شوند</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {letters.map(letter => {
                                                const typeCfg = LETTER_TYPE_CONFIG[letter.letter_type] ?? LETTER_TYPE_CONFIG.internal;
                                                const statusCfg = STATUS_CONFIG[letter.final_status] ?? STATUS_CONFIG.pending;
                                                const TypeIcon = typeCfg.icon;

                                                return (
                                                    <Link
                                                        key={letter.id}
                                                        href={lettersRoute.show(letter.id)}
                                                        className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-amber-50/50
                                                            border border-transparent hover:border-amber-100 transition-all group"
                                                    >
                                                        {/* Type icon */}
                                                        <div
                                                            className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                            style={{ backgroundColor: typeCfg.bg }}
                                                        >
                                                            <TypeIcon className="h-4 w-4" style={{ color: typeCfg.color }} />
                                                        </div>

                                                        {/* Title + number */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-800 truncate
                                                                group-hover:text-amber-700 transition-colors">
                                                                {letter.subject}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                    <Hash className="h-2.5 w-2.5" />
                                                                    {letter.letter_number || '—'}
                                                                </span>
                                                                {letter.date && (
                                                                    <>
                                                                        <span className="text-slate-200 text-xs">•</span>
                                                                        <span className="text-xs text-slate-400">
                                                                            {new Date(letter.date).toLocaleDateString('fa-IR')}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Status badge */}
                                                        <span
                                                            className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                                                            style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                                                        >
                                                            {statusCfg.label}
                                                        </span>

                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-300
                                                            group-hover:text-amber-400 flex-shrink-0" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </SectionCard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Delete confirmation modal ── */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden fade-up">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center">
                                <Trash2 className="h-4 w-4 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">حذف دسته‌بندی</h3>
                                <p className="text-xs text-slate-400 mt-0.5">این عملیات قابل بازگشت نیست</p>
                            </div>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-sm text-slate-600 leading-relaxed mb-5">
                                آیا مطمئن هستید که می‌خواهید دسته‌بندی
                                {' '}<span className="font-bold text-slate-800">«{category.name}»</span>{' '}
                                را حذف کنید؟
                                {(category.letters_count ?? letters.length) > 0 && (
                                    <span className="block mt-2 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                                        ⚠️ این دسته دارای {category.letters_count ?? letters.length} نامه است.
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600
                                        bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold
                                        text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}