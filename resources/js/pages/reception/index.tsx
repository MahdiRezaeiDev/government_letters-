import { Head, Link } from '@inertiajs/react';
import {
    Inbox, Send, Clock, CheckCircle, CornerUpRight,
    Building2, TrendingUp, XCircle, Mail, Reply, ArrowUpRight,
    BarChart3
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import cartable from '@/routes/cartable';
import letters from '@/routes/letters';

interface Department {
    id: number;
    name: string;
    code: string;
    organization?: { id: number; name: string };
}

interface Stats {
    reception: {
        total_received: number;
        pending: number;
        forwarded: number;
        rejected: number;
        today_received: number;
        week_received: number;
        month_received: number;
        month_forwarded: number;
    };
    department: {
        total_incoming: number;
        total_replies: number;
        replies_today: number;
        replies_this_week: number;
        replies_this_month: number;
        incoming_today: number;
        incoming_this_month: number;
    };
}

interface DepartmentBreakdown {
    id: number;
    name: string;
    code: string;
    organization?: string;
    received: number;
    pending: number;
    forwarded: number;
    incoming_letters: number;
    replies: number;
}

interface MonthlyTrend {
    month: string;
    incoming: number;
    replies: number;
}

interface PendingRouting {
    id: number;
    created_at: string;
    letter: {
        id: number;
        subject: string;
        letter_number: string;
        priority: string;
        recipient_department?: { id: number; name: string } | null;
    };
    from_user?: { first_name: string; last_name: string } | null;
}

interface ForwardedRouting {
    id: number;
    completed_at: string | null;
    letter: {
        id: number;
        subject: string;
        letter_number: string;
        recipient_department?: { id: number; name: string } | null;
        recipient_user?: { first_name: string; last_name: string } | null;
    };
    from_user?: { first_name: string; last_name: string } | null;
}

interface RecentReply {
    id: number;
    subject: string;
    letter_number: string;
    created_at: string;
    sender_user?: { first_name: string; last_name: string } | null;
    reply_to?: {
        id: number;
        subject: string;
        letter_number: string;
        recipient_department?: { id: number; name: string } | null;
    } | null;
}

interface Props {
    managedDepartments: Department[];
    stats: Stats;
    departmentBreakdown: DepartmentBreakdown[];
    monthlyTrend: MonthlyTrend[];
    pendingRoutings: PendingRouting[];
    recentForwarded: ForwardedRouting[];
    recentReplies: RecentReply[];
}

function formatMonth(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

    return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export default function ReceptionIndex({
    managedDepartments,
    stats,
    departmentBreakdown,
    monthlyTrend,
    pendingRoutings,
    recentForwarded,
    recentReplies,
}: Props) {
    const receptionCards = [
        { label: 'کل دریافتی دبیرخانه', value: stats.reception.total_received, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'در انتظار ارجاع', value: stats.reception.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'ارجاع شده', value: stats.reception.forwarded, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'رد شده', value: stats.reception.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'دریافتی امروز', value: stats.reception.today_received, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'دریافتی این ماه', value: stats.reception.month_received, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'ارجاع این ماه', value: stats.reception.month_forwarded, icon: ArrowUpRight, color: 'text-teal-600', bg: 'bg-teal-50' },
    ];

    const departmentCards = [
        { label: 'کل نامه‌های وارده ریاست', value: stats.department.total_incoming, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'وارده امروز', value: stats.department.incoming_today, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'وارده این ماه', value: stats.department.incoming_this_month, icon: Inbox, color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'کل پاسخ‌های ریاست', value: stats.department.total_replies, icon: Reply, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'پاسخ امروز', value: stats.department.replies_today, icon: Send, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'پاسخ این ماه', value: stats.department.replies_this_month, icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
    ];

    const chartData = monthlyTrend.map(item => ({
        ...item,
        label: formatMonth(item.month),
    }));

    return (
        <>
            <Head title="داشبورد دبیرخانه" />

            <div className="min-h-screen bg-slate-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">داشبورد دبیرخانه</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                آمار نامه‌های دریافتی و پاسخ‌های ریاست
                                {managedDepartments.length === 1 && ` — ${managedDepartments[0].name}`}
                            </p>
                        </div>
                        <Link
                            href={cartable.index()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                        >
                            <Inbox className="h-4 w-4" />
                            کارتابل دبیرخانه
                            {stats.reception.pending > 0 && (
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                    {stats.reception.pending}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Reception stats */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">آمار دبیرخانه</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                            {receptionCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-2`}>
                                            <Icon className={`h-4 w-4 ${card.color}`} />
                                        </div>
                                        <p className="text-xl font-bold text-slate-900">{card.value}</p>
                                        <p className="text-[11px] text-slate-500 mt-1 leading-tight">{card.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Department stats */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">آمار کلی ریاست</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {departmentCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-2`}>
                                            <Icon className={`h-4 w-4 ${card.color}`} />
                                        </div>
                                        <p className="text-xl font-bold text-slate-900">{card.value}</p>
                                        <p className="text-[11px] text-slate-500 mt-1 leading-tight">{card.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Chart + Department breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-indigo-500" />
                                روند ۶ ماه اخیر
                            </h2>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="incoming" name="نامه وارده" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="replies" name="پاسخ" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-indigo-500" />
                                    آمار به تفکیک ریاست
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="text-right px-4 py-3 font-medium">ریاست</th>
                                            <th className="text-center px-3 py-3 font-medium">دبیرخانه</th>
                                            <th className="text-center px-3 py-3 font-medium">انتظار</th>
                                            <th className="text-center px-3 py-3 font-medium">ارجاع</th>
                                            <th className="text-center px-3 py-3 font-medium">وارده</th>
                                            <th className="text-center px-3 py-3 font-medium">پاسخ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {departmentBreakdown.map((dept) => (
                                            <tr key={dept.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-900">{dept.name}</p>
                                                    {dept.organization && (
                                                        <p className="text-xs text-slate-400">{dept.organization}</p>
                                                    )}
                                                </td>
                                                <td className="text-center px-3 py-3 text-blue-600 font-medium">{dept.received}</td>
                                                <td className="text-center px-3 py-3 text-amber-600 font-medium">{dept.pending}</td>
                                                <td className="text-center px-3 py-3 text-emerald-600 font-medium">{dept.forwarded}</td>
                                                <td className="text-center px-3 py-3 text-slate-700">{dept.incoming_letters}</td>
                                                <td className="text-center px-3 py-3 text-slate-700">{dept.replies}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Pending */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    در انتظار ارجاع
                                </h2>
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                    {stats.reception.pending}
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                                {pendingRoutings.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-slate-400">نامه‌ای در انتظار نیست</p>
                                ) : (
                                    pendingRoutings.map((routing) => (
                                        <div key={routing.id} className="p-4 hover:bg-slate-50">
                                            <Link href={letters.show(routing.letter.id)} className="font-medium text-sm text-slate-900 hover:text-indigo-600 line-clamp-1">
                                                {routing.letter.subject}
                                            </Link>
                                            <p className="text-xs text-slate-400 mt-0.5">{routing.letter.letter_number}</p>
                                            {routing.letter.recipient_department && (
                                                <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                                                    <CornerUpRight className="h-3 w-3" />
                                                    {routing.letter.recipient_department.name}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent forwarded */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                    آخرین ارجاع‌ها
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                                {recentForwarded.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-slate-400">ارجاعی ثبت نشده</p>
                                ) : (
                                    recentForwarded.map((routing) => (
                                        <div key={routing.id} className="p-4 hover:bg-slate-50">
                                            <Link href={letters.show(routing.letter.id)} className="font-medium text-sm text-slate-900 hover:text-indigo-600 line-clamp-1">
                                                {routing.letter.subject}
                                            </Link>
                                            {routing.letter.recipient_user && (
                                                <p className="text-xs text-emerald-600 mt-1">
                                                    به: {routing.letter.recipient_user.first_name} {routing.letter.recipient_user.last_name}
                                                </p>
                                            )}
                                            {routing.letter.recipient_department && (
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    واحد: {routing.letter.recipient_department.name}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent replies */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Reply className="h-4 w-4 text-purple-500" />
                                    آخرین پاسخ‌های ریاست
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                                {recentReplies.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-slate-400">پاسخی ثبت نشده</p>
                                ) : (
                                    recentReplies.map((reply) => (
                                        <div key={reply.id} className="p-4 hover:bg-slate-50">
                                            <Link href={letters.show(reply.id)} className="font-medium text-sm text-slate-900 hover:text-indigo-600 line-clamp-1">
                                                {reply.subject}
                                            </Link>
                                            {reply.reply_to && (
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                    در پاسخ به: {reply.reply_to.subject}
                                                </p>
                                            )}
                                            {reply.sender_user && (
                                                <p className="text-xs text-purple-600 mt-1">
                                                    از: {reply.sender_user.first_name} {reply.sender_user.last_name}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
