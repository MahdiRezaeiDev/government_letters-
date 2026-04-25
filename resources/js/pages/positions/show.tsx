import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft, Briefcase, Building2, Award, FileText,
    CheckCircle, TrendingUp, Shield, Star, Crown, Zap, Users,
    Calendar, Edit, Trash2, AlertCircle, Info, Layers
} from 'lucide-react';
import React, { useState } from 'react';
import positions from '@/routes/positions';
import type { Position, Department } from '@/types';

interface Props {
    position: Position;
    department: Department;
}

// ─── Level config (same as create page) ──────────────────────────────────────────

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

// ─── Shared Component ─────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, color = '#6366f1' }: {
    icon: React.ElementType; label: string; value: React.ReactNode; color?: string;
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
                <Icon className="h-4.5 w-4.5" style={{ color }} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm text-slate-800 font-medium">{value || '—'}</p>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export default function PositionsShow({ position, department }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const levelInfo = getLevelInfo(position.level);
    const LevelIcon = levelInfo.icon;

    const handleDelete = () => {
        setDeleting(true);
        router.delete(positions.destroy({ position: position.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
            },
        });
    };

    // Format date
    const formatDate = (date: string) => {
        if (!date) {
            return '—';
        }

        return new Date(date).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={`مشاهده وظیفه - ${position.name}`} />

            <div className="min-h-screen bg-slate-50/70" dir="rtl">
                {/* Sticky Top Bar */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 tracking-wide">
                                    وظایف
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">مشاهده وظیفه</h1>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                    {position.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.edit({ position: position.id }))}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <Edit className="h-4 w-4" />
                                    ویرایش
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Body */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-5">
                        {/* Hero Section */}
                        <div className="rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50 to-purple-50 px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Briefcase className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-violet-600 mb-1">شناسه وظیفه</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-xl font-bold text-slate-800">{position.name}</h1>
                                        <span className="text-xs font-mono text-violet-600 bg-violet-100 px-2 py-1 rounded-md">
                                            {position.code}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Info Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                    <Info className="h-4 w-4 text-violet-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">اطلاعات وظیفه</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">مشخصات کامل وظیفه</p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Department */}
                                    <InfoRow
                                        icon={Building2}
                                        label="ریاست / دپارتمان"
                                        value={department?.name || '—'}
                                        color="#6366f1"
                                    />

                                    {/* Level */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: levelInfo.color + '15' }}>
                                            <LevelIcon className="h-4.5 w-4.5" style={{ color: levelInfo.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">سطح وظیفه</p>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                                    style={{
                                                        backgroundColor: levelInfo.bg,
                                                        color: levelInfo.color,
                                                        border: `1px solid ${levelInfo.color}30`,
                                                    }}
                                                >
                                                    <LevelIcon className="h-3 w-3" />
                                                    {levelInfo.label}
                                                </span>
                                                <span className="text-xs text-slate-400">(سطح {position.level})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Management Type */}
                                    <InfoRow
                                        icon={Award}
                                        label="نوع وظیفه"
                                        value={
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${position.is_management
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {position.is_management ? (
                                                    <>مدیریتی <Crown className="h-3 w-3" /></>
                                                ) : (
                                                    <>عادی <CheckCircle className="h-3 w-3" /></>
                                                )}
                                            </span>
                                        }
                                        color={position.is_management ? '#f59e0b' : '#6366f1'}
                                    />

                                    {/* Created At */}
                                    <InfoRow
                                        icon={Calendar}
                                        label="تاریخ ایجاد"
                                        value={formatDate(position.created_at)}
                                        color="#10b981"
                                    />
                                </div>

                                {/* Description */}
                                {position.description && (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-4.5 w-4.5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                    شرح وظایف و مسئولیت‌ها
                                                </p>
                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                        {position.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">آمار و اطلاعات</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">مشخصات آماری این وظیفه</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Layers className="h-5 w-5 text-violet-600 mx-auto mb-2" />
                                        <p className="text-xs text-slate-500 mb-1">شناسه وظیفه</p>
                                        <p className="text-sm font-bold text-slate-800 font-mono">{position.id}</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Building2 className="h-5 w-5 text-violet-600 mx-auto mb-2" />
                                        <p className="text-xs text-slate-500 mb-1">کد وظیفه</p>
                                        <p className="text-sm font-bold text-slate-800 font-mono">{position.code}</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <TrendingUp className="h-5 w-5 text-violet-600 mx-auto mb-2" />
                                        <p className="text-xs text-slate-500 mb-1">سطح وظیفه</p>
                                        <p className="text-sm font-bold text-slate-800">{position.level}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">حذف وظیفه</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">این عمل غیرقابل بازگشت است</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600">
                                آیا از حذف وظیفه <span className="font-bold text-slate-800">"{position.name}"</span> اطمینان دارید؟
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                                با حذف این وظیفه، تمام اطلاعات مرتبط با آن نیز حذف خواهد شد.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                {deleting ? 'در حال حذف...' : 'حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}