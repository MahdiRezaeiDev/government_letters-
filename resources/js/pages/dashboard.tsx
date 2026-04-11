import { Head, Link } from '@inertiajs/react';
import { 
    Inbox, Send, FileText, Clock, CheckCircle, AlertCircle,
    Users, Building2, Mail, TrendingUp, Archive, ChevronLeft
} from 'lucide-react';
import React from 'react';
import type { DashboardStats, Letter } from '@/types';

interface Props {
    stats: DashboardStats;
    recentLetters: Letter[];
}

export default function Dashboard({ stats, recentLetters }: Props) {
    const statCards = [
        { label: 'نامه‌های در انتظار', value: stats.pending_actions, icon: Clock, color: 'bg-yellow-500', href: route('cartable.index') },
        { label: 'نامه‌های وارده جدید', value: stats.incoming_new, icon: Inbox, color: 'bg-blue-500', href: route('letters.index', { type: 'incoming', status: 'pending' }) },
        { label: 'نامه‌های صادره جدید', value: stats.outgoing_new, icon: Send, color: 'bg-green-500', href: route('letters.index', { type: 'outgoing', status: 'pending' }) },
        { label: 'پیش‌نویس‌های من', value: stats.my_drafts, icon: FileText, color: 'bg-purple-500', href: route('letters.index', { status: 'draft' }) },
        { label: 'نامه‌های بایگانی شده', value: stats.archived_count, icon: Archive, color: 'bg-gray-500', href: route('archives.index') },
        { label: 'کاربران فعال', value: stats.total_users, icon: Users, color: 'bg-indigo-500', href: route('users.index') },
    ];

    const priorityColors = {
        low: 'bg-gray-100 text-gray-600',
        normal: 'bg-blue-100 text-blue-600',
        high: 'bg-yellow-100 text-yellow-600',
        urgent: 'bg-orange-100 text-orange-600',
        very_urgent: 'bg-red-100 text-red-600',
    };

    const priorityLabels = {
        low: 'کم',
        normal: 'عادی',
        high: 'مهم',
        urgent: 'فوری',
        very_urgent: 'خیلی فوری',
    };

    const statusColors = {
        draft: 'bg-gray-100 text-gray-600',
        pending: 'bg-yellow-100 text-yellow-600',
        approved: 'bg-green-100 text-green-600',
        rejected: 'bg-red-100 text-red-600',
        archived: 'bg-gray-100 text-gray-500',
    };

    const statusLabels = {
        draft: 'پیش‌نویس',
        pending: 'در انتظار',
        approved: 'تایید شده',
        rejected: 'رد شده',
        archived: 'بایگانی شده',
    };

    return (
        <>
            <Head title="داشبورد" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            خوش آمدید! خلاصه فعالیت‌های امروز شما
                        </p>
                    </div>
                    <Link
                        href={route('letters.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                        <Mail className="ml-2 h-4 w-4" />
                        نامه جدید
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`${card.color} rounded-lg p-2 group-hover:scale-105 transition`}>
                                    <card.icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{card.label}</p>
                                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Letters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">نامه‌های اخیر</h2>
                        <Link href={route('letters.index')} className="text-sm text-blue-600 hover:text-blue-700">
                            مشاهده همه
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentLetters.length === 0 ? (
                            <div className="px-6 py-8 text-center text-gray-500">
                                هیچ نامه‌ای وجود ندارد
                            </div>
                        ) : (
                            recentLetters.map((letter) => (
                                <Link
                                    key={letter.id}
                                    href={route('letters.show', letter.id)}
                                    className="block px-6 py-4 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[letter.priority]}`}>
                                                    {priorityLabels[letter.priority]}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[letter.final_status]}`}>
                                                    {statusLabels[letter.final_status]}
                                                </span>
                                                <span className="text-xs text-gray-400">{letter.letter_number}</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{letter.subject}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(letter.created_at).toLocaleDateString('fa-IR')}
                                            </p>
                                        </div>
                                        <ChevronLeft className="h-4 w-4 text-gray-400" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold text-gray-900">آمار کلی</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">کل نامه‌ها</span>
                                <span className="text-lg font-semibold text-gray-900">{stats.total_letters}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">کل کاربران</span>
                                <span className="text-lg font-semibold text-gray-900">{stats.total_users}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">کل دپارتمان‌ها</span>
                                <span className="text-lg font-semibold text-gray-900">{stats.total_departments}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                        <h3 className="font-semibold text-lg mb-2">نیاز به راهنمایی دارید؟</h3>
                        <p className="text-sm text-blue-100 mb-4">
                            برای مشاهده مستندات سیستم و آموزش کار با آن کلیک کنید
                        </p>
                        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                            مشاهده راهنما
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}