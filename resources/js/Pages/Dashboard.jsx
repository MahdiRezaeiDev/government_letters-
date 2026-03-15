import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    FileText,
    Inbox,
    Megaphone,
    Send,
    TrendingUp,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// کارت آماری
function StatCard({ title, value, icon: Icon, color, href }) {
    const card = (
        <div
            className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="mb-1 text-sm text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {value?.toLocaleString('fa-IR') || 0}
                    </p>
                </div>
                <div
                    className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center`}
                >
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </div>
    );
    return href ? <Link href={href}>{card}</Link> : card;
}

// برچسب اولویت
function PriorityBadge({ priority }) {
    const map = {
        low: { label: 'کم', cls: 'bg-gray-100 text-gray-600' },
        normal: { label: 'عادی', cls: 'bg-blue-100 text-blue-700' },
        high: { label: 'مهم', cls: 'bg-yellow-100 text-yellow-700' },
        urgent: { label: 'فوری', cls: 'bg-orange-100 text-orange-700' },
        very_urgent: { label: 'خیلی فوری', cls: 'bg-red-100 text-red-700' },
    };
    const { label, cls } = map[priority] || map.normal;
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

// برچسب نوع نامه
function TypeBadge({ type }) {
    const map = {
        incoming: { label: 'وارده', cls: 'bg-green-100 text-green-700' },
        outgoing: { label: 'صادره', cls: 'bg-purple-100 text-purple-700' },
        internal: { label: 'داخلی', cls: 'bg-blue-100 text-blue-700' },
    };
    const { label, cls } = map[type] || map.incoming;
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

export default function Dashboard({
    letterStats,
    cartableStats,
    recentLetters,
    announcements,
    chartData,
}) {
    // آماده‌سازی داده نمودار
    const chartGrouped = (chartData || []).reduce((acc, item) => {
        if (!acc[item.date])
            acc[item.date] = {
                date: item.date,
                incoming: 0,
                outgoing: 0,
                internal: 0,
            };
        acc[item.date][item.letter_type] = item.count;
        return acc;
    }, {});
    const chartFormatted = Object.values(chartGrouped || {});

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl font-bold text-gray-800">داشبورد</h1>
            }
        >
            <Head title="داشبورد" />

            <div className="space-y-6" dir="rtl">
                {/* ===== کارت‌های آماری نامه‌ها ===== */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        title="نامه‌های وارده"
                        value={letterStats?.incoming || 0}
                        icon={Inbox}
                        color="bg-green-500"
                        href="/letters?type=incoming"
                    />
                    <StatCard
                        title="نامه‌های صادره"
                        value={letterStats?.outgoing || 0}
                        icon={Send}
                        color="bg-purple-500"
                        href="/letters?type=outgoing"
                    />
                    <StatCard
                        title="نامه‌های داخلی"
                        value={letterStats?.internal || 0}
                        icon={FileText}
                        color="bg-blue-500"
                        href="/letters?type=internal"
                    />
                    <StatCard
                        title="در انتظار اقدام"
                        value={letterStats?.pending || 0}
                        icon={Clock}
                        color="bg-orange-500"
                        href="/letters?status=pending"
                    />
                </div>

                {/* ===== کارت‌های کارتابل ===== */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        title="کارتابل من"
                        value={cartableStats?.total || 0}
                        icon={Inbox}
                        color="bg-slate-600"
                        href="/cartable"
                    />
                    <StatCard
                        title="در انتظار"
                        value={cartableStats?.pending || 0}
                        icon={Clock}
                        color="bg-yellow-500"
                        href="/cartable"
                    />
                    <StatCard
                        title="تأخیر دار"
                        value={cartableStats?.overdue || 0}
                        icon={AlertCircle}
                        color="bg-red-500"
                        href="/cartable?overdue=1"
                    />
                    <StatCard
                        title="تکمیل امروز"
                        value={cartableStats?.completed || 0}
                        icon={CheckCircle}
                        color="bg-teal-500"
                        href="/cartable"
                    />
                </div>

                {/* ===== نمودار و اطلاعیه‌ها ===== */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* نمودار نامه‌ها */}
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                                <TrendingUp
                                    size={18}
                                    className="text-blue-500"
                                />
                                نامه‌های ۷ روز گذشته
                            </h2>
                        </div>
                        {chartFormatted.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={chartFormatted}>
                                    <defs>
                                        <linearGradient
                                            id="colorIn"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10B981"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10B981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorOut"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#8B5CF6"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8B5CF6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11 }}
                                    />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="incoming"
                                        name="وارده"
                                        stroke="#10B981"
                                        fill="url(#colorIn)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="outgoing"
                                        name="صادره"
                                        stroke="#8B5CF6"
                                        fill="url(#colorOut)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="internal"
                                        name="داخلی"
                                        stroke="#3B82F6"
                                        fill="none"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-56 items-center justify-center text-sm text-gray-400">
                                داده‌ای برای نمایش وجود ندارد
                            </div>
                        )}
                    </div>

                    {/* اطلاعیه‌ها */}
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
                            <Megaphone size={18} className="text-orange-500" />
                            اطلاعیه‌ها
                        </h2>
                        {announcements?.length > 0 ? (
                            <div className="space-y-3">
                                {announcements.map((a) => (
                                    <div
                                        key={a.id}
                                        className="rounded-lg border border-orange-100 bg-orange-50 p-3"
                                    >
                                        <p className="mb-1 text-sm font-medium text-gray-800">
                                            {a.title}
                                        </p>
                                        <p className="line-clamp-2 text-xs text-gray-500">
                                            {a.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-400">
                                اطلاعیه‌ای وجود ندارد
                            </p>
                        )}
                    </div>
                </div>

                {/* ===== آخرین نامه‌ها ===== */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <h2 className="font-semibold text-gray-800">
                            آخرین نامه‌ها
                        </h2>
                        <Link
                            href="/letters"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                            مشاهده همه <ArrowLeft size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">
                                        شماره
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">
                                        موضوع
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">
                                        نوع
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">
                                        اولویت
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">
                                        تاریخ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentLetters?.length > 0 ? (
                                    recentLetters.map((letter) => (
                                        <tr
                                            key={letter.id}
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() =>
                                                (window.location.href = `/letters/${letter.id}`)
                                            }
                                        >
                                            <td className="px-5 py-3 font-mono text-xs text-gray-500">
                                                {letter.letter_number || '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="max-w-xs truncate font-medium text-gray-800">
                                                    {letter.subject}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <TypeBadge
                                                    type={letter.letter_type}
                                                />
                                            </td>
                                            <td className="px-5 py-3">
                                                <PriorityBadge
                                                    priority={letter.priority}
                                                />
                                            </td>
                                            <td className="px-5 py-3 text-xs text-gray-500">
                                                {letter.date}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-10 text-center text-gray-400"
                                        >
                                            نامه‌ای ثبت نشده است
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
