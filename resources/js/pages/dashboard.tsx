import { Head, Link } from '@inertiajs/react';
import {
    Inbox, FileText, Clock, Archive, Users, 
    AlertCircle, BedDoubleIcon as CheckDouble, ArrowUpRight,
    History, ChevronLeft, Activity, 
    MoreHorizontal, Download, ArrowLeftRight
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// فرض بر این است که تایپ‌ها از قبل تعریف شده‌اند
interface Props {
    stats: any;
    recentLetters: any[];
    monthlyStats: any[];
}

export default function FinalProfessionalDashboard({ stats, recentLetters, monthlyStats }: Props) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        return () => clearInterval(timer);
    }, []);

    const pieData = useMemo(() => [
        { name: 'فوری', value: stats.urgent_count || 12, color: '#ef4444' },
        { name: 'عادی', value: stats.normal_count || 45, color: '#3b82f6' },
        { name: 'مهم', value: stats.high_count || 23, color: '#f59e0b' },
    ], [stats]);

    return (
        <div className="min-h-screen bg-gray-200 text-slate-900 font-['vazir'] selection:bg-indigo-100" dir="rtl">
            <Head title="داشبورد عملیاتی مکاتبات" />

            <main className="max-w-[1600px] mx-auto px-6 py-8">

                {/* --- QUICK ACTION TOOLBAR --- */}
                <section className="mb-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-black border border-rose-100 hover:bg-rose-100 transition">
                            <AlertCircle className="h-4 w-4" />
                            {stats.overdue || 5} پاسخ دیرهنگام
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-black border border-amber-100 hover:bg-amber-100 transition">
                            <Clock className="h-4 w-4" />
                            {stats.waiting_sign || 12} در انتظار امضا
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium ml-2">فیلتر نمایش:</span>
                        {['همه', 'وارده', 'صادره', 'داخلی'].map((tab) => (
                            <button key={tab} className="px-4 py-1.5 rounded-lg text-xs font-bold transition bg-white border border-slate-200 text-slate-600 hover:border-indigo-300">
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: CORE OPS --- */}
                    <div className="col-span-12 xl:col-span-9 space-y-8">

                        {/* BENTO STATS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Main Hero Card */}
                            <div className="md:col-span-2 bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <p className="text-indigo-100 text-sm font-medium">مجموع مکاتبات در جریان</p>
                                        <h3 className="text-5xl font-black mt-2 tracking-tighter">{stats.pending_actions || 42}</h3>
                                    </div>
                                    <div className="mt-8 flex items-center gap-4">
                                        <Link href="/cartable" className="bg-white text-indigo-600 px-6 py-2 rounded-2xl text-xs font-black hover:bg-indigo-50 transition">
                                            مدیریت کارتابل
                                        </Link>
                                        <span className="text-indigo-100 text-[11px] flex items-center gap-1">
                                            <Activity className="h-3 w-3" />
                                            ۱۲٪ افزایش نسبت به هفته قبل
                                        </span>
                                    </div>
                                </div>
                                <ArrowLeftRight className="absolute -left-10 -bottom-10 h-48 w-48 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
                            </div>

                            {/* Mini Metrics */}
                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col justify-between hover:shadow-lg transition">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Inbox className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">وارده امروز</p>
                                    <p className="text-2xl font-black text-slate-800">{stats.incoming_new || 8}</p>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col justify-between hover:shadow-lg transition">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <CheckDouble className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">مختومه شده</p>
                                    <p className="text-2xl font-black text-slate-800">{stats.closed_today || 15}</p>
                                </div>
                            </div>
                        </div>

                        {/* ANALYTICS SECTION */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">تحلیل زمانی گردش مکاتبات</h3>
                                    <p className="text-sm text-slate-400 mt-1">مقایسه حجم نامه‌های ورودی در بازه‌های زمانی</p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                                    <Download className="h-4 w-4" />
                                    دریافت گزارش PDF
                                </button>
                            </div>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyStats}>
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={15} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                                            cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* RECENT LETTERS TABLE */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                            <div className="p-7 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <h3 className="font-black text-slate-800 flex items-center gap-2">
                                    <History className="h-5 w-5 text-indigo-500" />
                                    آخرین مکتوبات در جریان
                                </h3>
                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                    مشاهده همه
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead>
                                        <tr className="text-slate-400 text-[11px] uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-5 font-bold">موضوع و عنوان مکتوب</th>
                                            <th className="px-8 py-5 font-bold">فرستنده / واحد</th>
                                            <th className="px-8 py-5 font-bold text-center">اولویت</th>
                                            <th className="px-8 py-5 font-bold">وضعیت فعلی</th>
                                            <th className="px-8 py-5 font-bold"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentLetters.map((letter) => (
                                            <tr key={letter.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-700">{letter.subject}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-mono">{letter.letter_no || 'NSIA-1402-120'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-600">ریاست منابع بشری</td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">فوری</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                        <span className="text-xs font-bold text-slate-600">در انتظار پاراف</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <button className="p-2 hover:bg-white rounded-lg transition text-slate-400 hover:text-indigo-600 shadow-sm">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: INSIGHTS & UTILS --- */}
                    <div className="col-span-12 xl:col-span-3 space-y-8">

                        {/* PRIORITY DONUT CHART */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="font-black text-slate-800 mb-8">تفکیک اولویت‌ها</h3>
                            <div className="h-60 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800">{stats.total_letters || 80}</span>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">کل مکتوبات</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3 mt-8">
                                {pieData.map((p) => (
                                    <div key={p.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                            <span className="text-xs font-bold text-slate-600">{p.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-800">{p.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LIVE NOTIFICATIONS FEED */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm">
                            <h3 className="font-black text-slate-800 mb-6 flex items-center justify-between">
                                رویدادهای اخیر
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                            </h3>
                            <div className="space-y-6 relative before:absolute before:right-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                {[
                                    { time: '۱۰:۴۵', msg: 'مکتوب شماره ۱۲۰ امضا شد', icon: CheckDouble, color: 'text-emerald-500' },
                                    { time: '۰۹:۳۰', msg: 'ارجاع جدید از واحد IT', icon: ArrowUpRight, color: 'text-indigo-500' },
                                    { time: '۰۸:۱۵', msg: 'یادآوری: مهلت پاسخ نامه ۴۴', icon: AlertCircle, color: 'text-rose-500' },
                                ].map((item, idx) => (
                                    <div key={idx} className="relative pr-9 group">
                                        <div className="absolute right-0 top-0 w-[24px] h-[24px] bg-white border-2 border-slate-100 rounded-full flex items-center justify-center z-10 group-hover:border-indigo-400 transition-colors">
                                            <item.icon className={`h-3 w-3 ${item.color}`} />
                                        </div>
                                        <p className="text-[10px] font-mono text-slate-400 leading-none">{item.time}</p>
                                        <p className="text-xs font-bold text-slate-600 mt-1.5 leading-relaxed">{item.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QUICK SHORTCUTS */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg transition group">
                                <Users className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition" />
                                <span className="text-[11px] font-black text-slate-600">دفترچه تلفن</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg transition group">
                                <Archive className="h-6 w-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
                                <span className="text-[11px] font-black text-slate-600">بایگانی راکد</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}