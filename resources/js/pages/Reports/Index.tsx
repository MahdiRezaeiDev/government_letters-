import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import * as letterRoutes from '@/routes/letters';
import * as reportRoutes from '@/routes/reports';

interface Stats { total: number; incoming: number; outgoing: number; internal: number; pending: number; approved: number; }
interface CategoryStat { name: string; count: number; }
interface Letter {
    id: number; subject: string; due_date: string; final_status: string;
    category: { name: string } | null; creator: { first_name: string; last_name: string } | null;
}
interface Props {
    stats: Stats; byPriority: Record<string, number>; byCategory: CategoryStat[];
    daily: Record<string, number>; overdue: Letter[]; filters: { from: string; to: string };
}

const PRIORITY_LABEL: Record<string, string> = {
    low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری',
};

const PRIORITY_COLOR: Record<string, string> = {
    low: 'bg-gray-400', normal: 'bg-blue-400', high: 'bg-yellow-400',
    urgent: 'bg-orange-400', very_urgent: 'bg-red-500',
};

export default function Index({ stats, byPriority, byCategory, daily, overdue, filters }: Props) {

    const [from, setFrom] = useState(filters.from);
    const [to,   setTo]   = useState(filters.to);

    function handleFilter() {
        router.get(reportRoutes.index().url, { from, to }, { preserveState: true });
    }

    const maxDaily    = Math.max(...Object.values(daily), 1);
    const maxCategory = Math.max(...byCategory.map(c => c.count), 1);

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'گزارش‌ها', href: reportRoutes.index().url }]}>
            <Head title="گزارش‌ها" />
            <div className="p-6 space-y-6">

                <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">از تاریخ</label>
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">تا تاریخ</label>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>
                    <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">اعمال فیلتر</button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'کل نامه‌ها', value: stats.total,    color: 'text-gray-700',   bg: 'bg-gray-50' },
                        { label: 'وارده',       value: stats.incoming, color: 'text-blue-700',   bg: 'bg-blue-50' },
                        { label: 'صادره',       value: stats.outgoing, color: 'text-green-700',  bg: 'bg-green-50' },
                        { label: 'داخلی',       value: stats.internal, color: 'text-purple-700', bg: 'bg-purple-50' },
                        { label: 'در انتظار',   value: stats.pending,  color: 'text-orange-700', bg: 'bg-orange-50' },
                        { label: 'تأیید شده',   value: stats.approved, color: 'text-teal-700',   bg: 'bg-teal-50' },
                    ].map((item, i) => (
                        <div key={i} className={`${item.bg} rounded-lg p-4 border`}>
                            <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm font-semibold text-gray-600 mb-4">نامه‌های ۳۰ روز اخیر</h2>
                        <div className="flex items-end gap-1 h-32">
                            {Object.entries(daily).map(([date, count]) => (
                                <div key={date} className="flex-1 flex flex-col items-center gap-1" title={`${date}: ${count} نامه`}>
                                    <div className="w-full bg-blue-400 rounded-t transition-all hover:bg-blue-600"
                                        style={{ height: `${(count / maxDaily) * 100}%`, minHeight: '2px' }} />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">هر ستون = یک روز</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm font-semibold text-gray-600 mb-4">بر اساس اولویت</h2>
                        <div className="space-y-3">
                            {Object.entries(byPriority).map(([priority, count]) => (
                                <div key={priority}>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>{PRIORITY_LABEL[priority] ?? priority}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="bg-gray-100 rounded-full h-2">
                                        <div className={`${PRIORITY_COLOR[priority] ?? 'bg-gray-400'} h-2 rounded-full`}
                                            style={{ width: `${(count / stats.total) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {byCategory.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm font-semibold text-gray-600 mb-4">بر اساس دسته‌بندی</h2>
                        <div className="space-y-3">
                            {byCategory.map((cat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>{cat.name}</span><span>{cat.count}</span>
                                    </div>
                                    <div className="bg-gray-100 rounded-full h-2">
                                        <div className="bg-purple-400 h-2 rounded-full"
                                            style={{ width: `${(cat.count / maxCategory) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {overdue.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="font-semibold text-red-600">نامه‌های معوق ({overdue.length})</h2>
                        </div>
                        <div className="divide-y">
                            {overdue.map(letter => (
                                <div key={letter.id} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{letter.subject}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {letter.creator ? `${letter.creator.first_name} ${letter.creator.last_name}` : '---'}
                                            {letter.category && ` · ${letter.category.name}`}
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-red-500 font-medium">مهلت: {letter.due_date}</p>
                                        <a href={letterRoutes.show(letter.id).url} className="text-xs text-blue-600 hover:underline">مشاهده</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
