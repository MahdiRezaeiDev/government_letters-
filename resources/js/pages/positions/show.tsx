import { Head, router } from '@inertiajs/react';
import {
    ArrowRight, Briefcase, Building2, FileText,
    CheckCircle, TrendingUp, Shield, Star, Crown, Zap, Users,
    Calendar, Edit, Trash2, AlertCircle, Info, Layers
} from 'lucide-react';
import { useState } from 'react';
import positions from '@/routes/positions';
import type { Position } from '@/types';

interface Props {
    position: Position;
    stats: {
        total_users: number;
        active_users: number;
        primary_users: number;
    };
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

// ─── Main Component ────────────────────────────────────────────────────────

export default function PositionsShow({ position, stats }: Props) {
    const levelInfo = getLevelInfo(position.level);
    const LevelIcon = levelInfo.icon;

    const formatDate = (date: string) => {
        if (!date) {
            return '—';
        }

        return new Date(date).toLocaleDateString('fa-AF', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title={`مشاهده وظیفه - ${position.name}`} />

            <div className="min-h-screen">
                {/* Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Basic Info Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900">اطلاعات پایه</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Organization & Department */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">وزارت</p>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {position.department?.organization?.name || '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Layers className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">ریاست</p>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {position.department?.name || '—'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level & Type */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: levelInfo.bg }}
                                            >
                                                <LevelIcon className="h-4 w-4" style={{ color: levelInfo.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">سطح وظیفه</p>
                                                <span
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: levelInfo.bg,
                                                        color: levelInfo.color,
                                                        border: `1px solid ${levelInfo.color}30`
                                                    }}
                                                >
                                                    {levelInfo.label} (سطح {position.level})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${position.is_management ? 'bg-amber-50' : 'bg-slate-100'
                                                }`}>
                                                {position.is_management ? (
                                                    <Crown className="h-4 w-4 text-amber-600" />
                                                ) : (
                                                    <Users className="h-4 w-4 text-slate-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">نوع وظیفه</p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${position.is_management
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {position.is_management ? 'مدیریتی' : 'عملیاتی'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">تاریخ ایجاد</p>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {formatDate(position.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">آخرین به‌روزرسانی</p>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {formatDate(position.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Card */}
                            {position.description && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">شرح وظایف و مسئولیت‌ها</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {position.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Users List (if exists) */}
                            {position.users && position.users.length > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">کاربران دارای این وظیفه</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {position.users.map((user: any) => (
                                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                                                            <Users className="h-4 w-4 text-violet-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">{user.name}</p>
                                                            <p className="text-xs text-slate-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    {user.pivot?.is_primary && (
                                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                            اصلی
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Stats Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900">آمار</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-violet-500" />
                                            <span className="text-xs text-slate-600">کل کاربران</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{stats.total_users}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-xs text-green-700">کاربران فعال</span>
                                        </div>
                                        <span className="text-sm font-bold text-green-800">{stats.active_users}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-amber-500" />
                                            <span className="text-xs text-amber-700">کاربران اصلی</span>
                                        </div>
                                        <span className="text-sm font-bold text-amber-800">{stats.primary_users}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Info Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900">اطلاعات سریع</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">شناسه</p>
                                        <p className="text-sm font-mono font-bold text-slate-800">#{position.id}</p>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">کد</p>
                                        <p className="text-sm font-mono font-bold text-slate-800">{position.code}</p>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">وضعیت</p>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <CheckCircle className="h-3 w-3" />
                                            فعال
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="bg-violet-50/50 rounded-xl border border-violet-100 p-5">
                                <h4 className="text-sm font-semibold text-violet-900 mb-3">راهنما</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-xs text-violet-700">
                                        <Info className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                                        کاربران اصلی مسئولیت اصلی این وظیفه را دارند
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-violet-700">
                                        <Info className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                                        وظایف مدیریتی قابلیت تأیید و تصویب دارند
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}