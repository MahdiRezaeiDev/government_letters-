import { Head, Link } from '@inertiajs/react';
import {
    Inbox, FileText, Clock, Archive, Users,
    AlertCircle, ArrowUpRight, History,
    ChevronLeft, Activity, Download,
    BookOpen, LayoutGrid, Bell, Search,
    TrendingUp, CheckCircle2, Send, Edit3
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Props {
    stats: {
        pending_actions?: number;
        incoming_new?: number;
        outgoing_new?: number;
        my_drafts?: number;
        total_letters?: number;
        total_users?: number;
        total_departments?: number;
        archived_count?: number;
    };
    recentLetters: {
        id: number;
        subject: string;
        letter_number?: string;
        priority?: string;
        final_status?: string;
        created_at?: string;
    }[];
    monthlyStats?: { month: string; count: number }[];
}

const priorityConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    urgent: { label: 'فوری', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
    high: { label: 'مهم', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    normal: { label: 'عادی', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    low: { label: 'پایین', bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'در انتظار', color: 'text-amber-600' },
    approved: { label: 'تأیید شده', color: 'text-emerald-600' },
    rejected: { label: 'رد شده', color: 'text-red-600' },
    archived: { label: 'بایگانی', color: 'text-slate-500' },
};

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function Dashboard({ stats = {}, recentLetters = [], monthlyStats = [] }: Props) {
    const [activeTab, setActiveTab] = useState<'همه' | 'وارده' | 'صادره' | 'داخلی'>('همه');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const persianDate = currentTime.toLocaleDateString('fa-IR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const pieData = useMemo(() => [
        { name: 'فوری', value: 12, color: PIE_COLORS[0] },
        { name: 'مهم', value: 23, color: PIE_COLORS[1] },
        { name: 'عادی', value: 45, color: PIE_COLORS[2] },
        { name: 'پایین', value: 8, color: PIE_COLORS[3] },
    ], []);

    const statCards = [
        { label: 'کارتابل فعال', value: stats.pending_actions ?? 42, icon: LayoutGrid, gradient: 'from-violet-500 to-indigo-600', iconBg: 'bg-white/20' },
        { label: 'وارده امروز', value: stats.incoming_new ?? 8, icon: Inbox, gradient: 'from-blue-500 to-cyan-500', iconBg: 'bg-white/20' },
        { label: 'صادره امروز', value: stats.outgoing_new ?? 5, icon: Send, gradient: 'from-emerald-500 to-teal-500', iconBg: 'bg-white/20' },
        { label: 'پیش‌نویس‌ها', value: stats.my_drafts ?? 3, icon: Edit3, gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-white/20' },
    ];

    const infoCards = [
        { label: 'کل مکتوبات', value: stats.total_letters ?? 234, icon: BookOpen, color: 'text-violet-600' },
        { label: 'کاربران سیستم', value: stats.total_users ?? 18, icon: Users, color: 'text-blue-600' },
        { label: 'دپارتمان‌ها', value: stats.total_departments ?? 7, icon: Archive, color: 'text-emerald-600' },
        { label: 'بایگانی شده', value: stats.archived_count ?? 89, icon: CheckCircle2, color: 'text-amber-600' },
    ];

    const sampleMonthly = monthlyStats.length > 0 ? monthlyStats : [
        { month: 'فروردین', count: 30 },
        { month: 'اردیبهشت', count: 52 },
        { month: 'خرداد', count: 41 },
        { month: 'تیر', count: 63 },
        { month: 'مرداد', count: 55 },
        { month: 'شهریور', count: 78 },
    ];

    const notifications = [
        { time: '۱۰:۴۵', msg: 'مکتوب شماره ۱۲۰ با موفقیت امضا شد', icon: CheckCircle2, color: 'text-emerald-500', dot: 'bg-emerald-500' },
        { time: '۰۹:۳۰', msg: 'ارجاع جدید از واحد فناوری اطلاعات', icon: ArrowUpRight, color: 'text-indigo-500', dot: 'bg-indigo-500' },
        { time: '۰۸:۱۵', msg: 'یادآوری: مهلت پاسخ نامه شماره ۴۴', icon: AlertCircle, color: 'text-red-500', dot: 'bg-red-500' },
        { time: '۰۷:۵۰', msg: 'پیش‌نویس جدید ذخیره شد', icon: Edit3, color: 'text-amber-500', dot: 'bg-amber-500' },
    ];

    return (
        <div className="min-h-screen">
            <Head title="داشبورد مکاتبات" />
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6">
                {/* ═══════════════ MAIN STAT CARDS ═══════════════ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(({ label, value, icon: Icon, gradient, iconBg }) => (
                        <div key={label}
                            className={`relative bg-gradient-to-br ${gradient} rounded-xl p-5 overflow-hidden shadow-md`}>
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <p className="text-white/80 text-xs font-medium">{label}</p>
                                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                                </div>
                                <div className={`${iconBg} p-2.5 rounded-lg`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="relative z-10 mt-4 flex items-center gap-1 text-white/70 text-xs">
                                <TrendingUp className="h-3 w-3" />
                                ۸٪ نسبت به هفته قبل
                            </div>
                        </div>
                    ))}
                </div>

                {/* ═══════════════ SECONDARY INFO CARDS ═══════════════ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {infoCards.map(({ label, value, icon: Icon, color }) => (
                        <div key={label}
                            className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
                            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <Icon className={`h-5 w-5 ${color}`} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">{label}</p>
                                <p className="text-2xl font-bold text-slate-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ═══════════════ CHART + PIE ═══════════════ */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Area Chart */}
                    <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">تحلیل گردش مکاتبات</h3>
                                <p className="text-slate-500 text-xs mt-0.5">حجم نامه‌های ورودی بر اساس ماه</p>
                            </div>
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                                <Activity className="h-3.5 w-3.5" />
                                زنده
                            </span>
                        </div>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sampleMonthly}>
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            color: '#334155',
                                            fontSize: 12,
                                            padding: '10px 16px',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                        }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#6366f1"
                                        strokeWidth={3} fill="url(#areaGrad)" dot={false}
                                        activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h3 className="font-bold text-slate-900 text-base mb-1">تفکیک اولویت‌ها</h3>
                        <p className="text-slate-500 text-xs mb-4">توزیع مکتوبات بر اساس اولویت</p>
                        <div className="h-44 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={52} outerRadius={72}
                                        paddingAngle={6} dataKey="value" stroke="none">
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-slate-900">{stats.total_letters ?? 88}</span>
                                <span className="text-xs text-slate-500 font-medium">کل نامه</span>
                            </div>
                        </div>
                        <div className="space-y-2.5 mt-4">
                            {pieData.map(p => (
                                <div key={p.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                        <span className="text-xs text-slate-600">{p.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{p.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════ TABLE + NOTIFICATIONS ═══════════════ */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Letters Table */}
                    <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <History className="h-4 w-4 text-indigo-500" />
                                آخرین مکتوبات
                            </h3>
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                {(['همه', 'وارده', 'صادره', 'داخلی'] as const).map(tab => (
                                    <button key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="text-slate-500 text-xs font-medium border-b border-slate-100">
                                        <th className="px-6 py-3">موضوع</th>
                                        <th className="px-6 py-3 text-center">اولویت</th>
                                        <th className="px-6 py-3">وضعیت</th>
                                        <th className="px-6 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentLetters.length > 0 ? recentLetters : [
                                        { id: 1, subject: 'درخواست تأمین بودجه سالانه واحد IT', letter_number: 'NSIA-1403-001', priority: 'urgent', final_status: 'pending' },
                                        { id: 2, subject: 'گزارش عملکرد ماهانه منابع بشری', letter_number: 'NSIA-1403-002', priority: 'high', final_status: 'approved' },
                                        { id: 3, subject: 'اطلاعیه تغییر ساعات اداری', letter_number: 'NSIA-1403-003', priority: 'normal', final_status: 'pending' },
                                        { id: 4, subject: 'درخواست مرخصی کارمندان دفتر مرکزی', letter_number: 'NSIA-1403-004', priority: 'low', final_status: 'archived' },
                                        { id: 5, subject: 'صورت‌جلسه کمیسیون بودجه مشترک', letter_number: 'NSIA-1403-005', priority: 'high', final_status: 'rejected' },
                                    ]).map(letter => {
                                        const pri = priorityConfig[letter.priority ?? 'normal'] ?? priorityConfig.normal;
                                        const sts = statusConfig[letter.final_status ?? 'pending'] ?? statusConfig.pending;
                                        return (
                                            <tr key={letter.id}
                                                className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition">
                                                            <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-700 line-clamp-1">{letter.subject}</p>
                                                            <p className="text-xs text-slate-400 font-mono mt-0.5">{letter.letter_number ?? '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${pri.bg} ${pri.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                                                        {pri.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-medium ${sts.color}`}>{sts.label}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/letters/${letter.id}`}
                                                        className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-700 transition text-xs font-medium flex items-center gap-1">
                                                        مشاهده <ChevronLeft className="h-3.5 w-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-3 border-t border-slate-100 text-center">
                            <Link href="/letters" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition">
                                مشاهده همه مکتوبات ←
                            </Link>
                        </div>
                    </div>

                    {/* Notifications + Shortcuts */}
                    <div className="space-y-5">

                        {/* Notifications */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-indigo-500" />
                                    رویدادهای اخیر
                                </h3>
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </div>
                            <div className="space-y-4 relative">
                                <div className="absolute right-3 top-2 bottom-2 w-px bg-slate-200" />
                                {notifications.map((n, i) => (
                                    <div key={i} className="relative pr-8 group">
                                        <div className="absolute right-0 top-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10 group-hover:border-indigo-300 transition">
                                            <n.icon className={`h-2.5 w-2.5 ${n.color}`} />
                                        </div>
                                        <p className="text-xs font-mono text-slate-400">{n.time}</p>
                                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shortcuts */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'دفترچه تلفن', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', href: '/contacts' },
                                { label: 'بایگانی', icon: Archive, color: 'text-amber-600', bg: 'bg-amber-50', href: '/archive' },
                                { label: 'کارتابل', icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50', href: '/cartable' },
                                { label: 'نامه جدید', icon: Edit3, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/letters/create' },
                            ].map(s => (
                                <Link key={s.label} href={s.href}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 ${s.bg} hover:border-slate-300 hover:shadow-sm transition-all group`}>
                                    <s.icon className={`h-5 w-5 ${s.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800">{s.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}