import { Head, Link } from '@inertiajs/react';
import {
    Inbox, Send, Clock, CheckCircle, CornerUpRight,
    Building2, FileText, TrendingUp
} from 'lucide-react';
import cartable from '@/routes/cartable';
import letters from '@/routes/letters';

interface Department {
    id: number;
    name: string;
    code: string;
    organization?: { id: number; name: string };
}

interface Routing {
    id: number;
    status: string;
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

interface Props {
    managedDepartments: Department[];
    stats: {
        total_received: number;
        pending: number;
        forwarded: number;
        today_received: number;
        replies: number;
    };
    recentRoutings: Routing[];
}

export default function ReceptionIndex({ managedDepartments, stats, recentRoutings }: Props) {
    const statCards = [
        { label: 'کل نامه‌های دریافتی', value: stats.total_received, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'در انتظار ارجاع', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'ارجاع شده', value: stats.forwarded, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'دریافتی امروز', value: stats.today_received, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'نامه‌های دارای پاسخ', value: stats.replies, icon: Send, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <>
            <Head title="دبیرخانه" />

            <div className="min-h-screen bg-slate-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">دبیرخانه</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                مدیریت نامه‌های دریافتی و ارجاع به واحدهای زیرمجموعه
                            </p>
                        </div>
                        <Link
                            href={cartable.index()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                        >
                            <Inbox className="h-4 w-4" />
                            کارتابل دبیرخانه
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {statCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
                                    <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                                        <Icon className={`h-5 w-5 ${card.color}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                                    <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
                            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                ریاست‌های تحت پوشش
                            </h2>
                            <div className="space-y-3">
                                {managedDepartments.map((dept) => (
                                    <div key={dept.id} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <p className="font-medium text-sm text-indigo-900">{dept.name}</p>
                                        {dept.organization && (
                                            <p className="text-xs text-indigo-600 mt-0.5">{dept.organization.name}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-900">آخرین نامه‌های دریافتی</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {recentRoutings.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400 text-sm">
                                        هنوز نامه‌ای دریافت نشده است
                                    </div>
                                ) : (
                                    recentRoutings.map((routing) => (
                                        <div key={routing.id} className="p-4 hover:bg-slate-50 transition">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={letters.show(routing.letter.id)}
                                                        className="font-medium text-slate-900 hover:text-indigo-600 line-clamp-1"
                                                    >
                                                        {routing.letter.subject}
                                                    </Link>
                                                    <p className="text-xs text-slate-400 mt-1">{routing.letter.letter_number}</p>
                                                    {routing.letter.recipient_department && (
                                                        <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
                                                            <CornerUpRight className="h-3 w-3" />
                                                            واحد مقصد: {routing.letter.recipient_department.name}
                                                        </p>
                                                    )}
                                                    {routing.from_user && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            از: {routing.from_user.first_name} {routing.from_user.last_name}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                                                    routing.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {routing.status === 'pending' ? 'در انتظار' : 'ارجاع شده'}
                                                </span>
                                            </div>
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
