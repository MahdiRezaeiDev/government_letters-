// resources/js/pages/dashboard.tsx

import { Head, Link } from '@inertiajs/react';
import { 
    Inbox, Send, FileText, Clock, Archive, Users, Mail,
    TrendingUp, TrendingDown, CheckCircle, XCircle, 
    Eye, Download, UserCheck, FileSignature, Activity,
    Calendar, Bell, ChevronRight, MoreHorizontal,
    Zap, Target, Award, Briefcase, Building2, Layers
} from 'lucide-react';
import { index as ArchiveIndex } from '@/routes/archives';
import { index as CartableIndex } from '@/routes/cartable';
import { index as LetterIndex, create as LetterCreate, show as LetterShow } from '@/routes/letters';
import { index as UserIndex } from '@/routes/users';
import type { DashboardStats, Letter } from '@/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';

interface Props {
    stats: DashboardStats;
    recentLetters: Letter[];
    monthlyStats?: { month: string; count: number }[];
    departmentStats?: { department: string; count: number }[];
    priorityStats?: { priority: string; count: number }[];
}

export default function Dashboard({ 
    stats, 
    recentLetters, 
    monthlyStats = [], 
    departmentStats = [], 
    priorityStats = [] 
}: Props) {
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('صبح بخیر');
        else if (hour < 18) setGreeting('بعد از ظهر بخیر');
        else setGreeting('شب بخیر');

        setCurrentTime(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
    }, []);

    const priorityColors = {
        low: '#9ca3af',
        normal: '#3b82f6',
        high: '#eab308',
        urgent: '#f97316',
        very_urgent: '#ef4444',
    };

    const priorityLabels = {
        low: 'کم',
        normal: 'عادی',
        high: 'مهم',
        urgent: 'فوری',
        very_urgent: 'خیلی فوری',
    };

    // کارت‌های آمار اصلی
    const mainStatCards = [
        { 
            label: 'در انتظار اقدام', 
            value: stats.pending_actions, 
            icon: Clock, 
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            iconBg: 'bg-yellow-500',
            href: CartableIndex(),
            trend: '+12%',
            trendUp: true
        },
        { 
            label: 'نامه‌های وارده', 
            value: stats.incoming_new, 
            icon: Inbox, 
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            iconBg: 'bg-blue-500',
            href: LetterIndex({ query: { type: 'incoming', status: 'pending' } }),
            trend: '+8%',
            trendUp: true
        },
        { 
            label: 'نامه‌های صادره', 
            value: stats.outgoing_new, 
            icon: Send, 
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            iconBg: 'bg-green-500',
            href: LetterIndex({ query: { type: 'outgoing', status: 'pending' } }),
            trend: '-3%',
            trendUp: false
        },
        { 
            label: 'پیش‌نویس‌ها', 
            value: stats.my_drafts, 
            icon: FileText, 
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            iconBg: 'bg-purple-500',
            href: LetterIndex({ query: { status: 'draft' } }),
            trend: '+5%',
            trendUp: true
        },
    ];

    // کارت‌های آمار ثانویه
    const secondaryStatCards = [
        { 
            label: 'کل نامه‌ها', 
            value: stats.total_letters, 
            icon: FileSignature, 
            color: 'from-indigo-500 to-indigo-600',
            bgColor: 'bg-indigo-50',
            iconBg: 'bg-indigo-500',
        },
        { 
            label: 'کاربران فعال', 
            value: stats.total_users, 
            icon: Users, 
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            iconBg: 'bg-emerald-500',
            href: UserIndex()
        },
        { 
            label: 'دپارتمان‌ها', 
            value: stats.total_departments, 
            icon: Building2, 
            color: 'from-rose-500 to-rose-600',
            bgColor: 'bg-rose-50',
            iconBg: 'bg-rose-500',
        },
        { 
            label: 'بایگانی شده', 
            value: stats.archived_count, 
            icon: Archive, 
            color: 'from-gray-500 to-gray-600',
            bgColor: 'bg-gray-50',
            iconBg: 'bg-gray-500',
            href: ArchiveIndex()
        },
    ];

    // داده‌های نمودار اولویت
    const pieData = Object.entries(priorityStats).map(([priority, count]) => ({
        name: priorityLabels[priority as keyof typeof priorityLabels],
        value: count,
        color: priorityColors[priority as keyof typeof priorityColors],
    }));

    // اقدامات سریع
    const quickActions = [
        { title: 'نامه وارده جدید', icon: Inbox, href: LetterCreate({ query: { type: 'incoming' } }), color: 'blue' },
        { title: 'نامه صادره جدید', icon: Send, href: LetterCreate({ query: { type: 'outgoing' } }), color: 'green' },
        { title: 'نامه داخلی جدید', icon: FileText, href: LetterCreate({ query: { type: 'internal' } }), color: 'purple' },
        { title: 'مدیریت کاربران', icon: Users, href: UserIndex(), color: 'indigo' },
        { title: 'کارتابل من', icon: Clock, href: CartableIndex(), color: 'yellow' },
        { title: 'بایگانی', icon: Archive, href: ArchiveIndex(), color: 'gray' },
    ];

    return (
        <>
            <Head title="داشبورد" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header with Greeting */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    {greeting} 👋
                                </h1>
                                <p className="text-gray-500 mt-1 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    <span className="text-gray-300">|</span>
                                    <Clock className="h-4 w-4" />
                                    {currentTime}
                                </p>
                            </div>
                            <Link
                                href={LetterCreate()}
                                className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Mail className="ml-2 h-5 w-5" />
                                ایجاد نامه جدید
                            </Link>
                        </div>
                    </div>

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {mainStatCards.map((card) => (
                            <Link
                                key={card.label}
                                href={card.href}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString('fa-IR')}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            {card.trendUp ? (
                                                <TrendingUp className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 text-red-500" />
                                            )}
                                            <span className={`text-xs ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                                {card.trend}
                                            </span>
                                            <span className="text-xs text-gray-400">از ماه قبل</span>
                                        </div>
                                    </div>
                                    <div className={`${card.iconBg} rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <card.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Monthly Chart */}
                        {monthlyStats.length > 0 && (
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">آمار ماهیانه</h3>
                                        <p className="text-xs text-gray-500 mt-1">تغییرات نامه‌ها در ۶ ماه اخیر</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Activity className="h-3 w-3" />
                                        <span>روند صعودی</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={monthlyStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'white', 
                                                borderRadius: '12px',
                                                border: '1px solid #e5e7eb',
                                                fontSize: '12px'
                                            }} 
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#3b82f6" 
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="تعداد نامه‌ها"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Priority Distribution */}
                        {pieData.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div>
                                    <h3 className="font-semibold text-gray-900">توزیع اولویت‌ها</h3>
                                    <p className="text-xs text-gray-500 mt-1">بر اساس اولویت نامه‌ها</p>
                                </div>
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Secondary Stats & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Secondary Stats Cards */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {secondaryStatCards.map((card) => (
                                    <div
                                        key={card.label}
                                        className={`${card.bgColor} rounded-xl p-4 ${card.href ? 'cursor-pointer hover:shadow-md transition' : ''}`}
                                        onClick={() => card.href && window.location.assign(card.href)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`${card.iconBg} rounded-lg p-2`}>
                                                <card.icon className="h-4 w-4 text-white" />
                                            </div>
                                            {card.href && <ChevronRight className="h-4 w-4 text-gray-400" />}
                                        </div>
                                        <p className="text-xs text-gray-500">{card.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value.toLocaleString('fa-IR')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Letters */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-gray-50 to-white">
                                <div>
                                    <h3 className="font-semibold text-gray-900">نامه‌های اخیر</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">آخرین نامه‌های ثبت شده</p>
                                </div>
                                <Link href={LetterIndex()} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    مشاهده همه
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                                {recentLetters.length === 0 ? (
                                    <div className="px-5 py-12 text-center">
                                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">هیچ نامه‌ای وجود ندارد</p>
                                    </div>
                                ) : (
                                    recentLetters.map((letter, index) => (
                                        <Link
                                            key={letter.id}
                                            href={LetterShow({ letter: letter.id })}
                                            className="block px-5 py-3 hover:bg-gray-50 transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                        index % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50'
                                                    } group-hover:scale-105 transition`}>
                                                        <FileText className={`h-5 w-5 ${
                                                            index % 2 === 0 ? 'text-blue-500' : 'text-purple-500'
                                                        }`} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {letter.subject}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-gray-400">{letter.letter_number}</span>
                                                        <span className="text-xs text-gray-300">•</span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(letter.created_at).toLocaleDateString('fa-IR')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition" />
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">دسترسی سریع</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">عملیات پرکاربرد سیستم</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-${action.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <action.icon className={`h-6 w-6 text-${action.color}-500`} />
                                        </div>
                                        <span className="text-xs text-gray-600 text-center">{action.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                            <Target className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">تکمیل امروز</p>
                            <p className="text-xl font-bold text-blue-600">{stats.pending_actions || 0}</p>
                        </div>
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">تأیید شده</p>
                            <p className="text-xl font-bold text-green-600">{stats.approved_count || 0}</p>
                        </div>
                        <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-xl p-4 text-center">
                            <XCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">رد شده</p>
                            <p className="text-xl font-bold text-red-600">{stats.rejected_count || 0}</p>
                        </div>
                        <div className="bg-linear-to-r from-purple-50 to-violet-50 rounded-xl p-4 text-center">
                            <Eye className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">مشاهده امروز</p>
                            <p className="text-xl font-bold text-purple-600">{stats.today_views || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}